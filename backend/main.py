from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import logging
import random
import models, schemas, database, crud
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

database.init_db()

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/user", response_model=schemas.UserOut)
def create_or_get_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        logger.info(f"User '{user.username}' logged in.")
        return db_user
    new_user = crud.create_user(db, user)
    logger.info(f"User '{user.username}' created.")
    return new_user

@app.post("/game/start", response_model=schemas.GameStartResponse)
def start_game(user_id: int, db: Session = Depends(database.get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        logger.warning(f"User with id {user_id} not found.")
        raise HTTPException(status_code=404, detail="User not found")
    number = random.randint(0, 1000)
    new_game = crud.create_game(db, user_id, number)
    logger.info(f"Game {new_game.id} started for user {user_id} with number {number}.")
    return schemas.GameStartResponse(game_id=new_game.id, number=number)

@app.post("/game/guess", response_model=schemas.GuessResponse)
def make_guess(guess_req: schemas.GuessRequest, db: Session = Depends(database.get_db)):
    game = crud.get_game_by_id(db, guess_req.game_id)
    if not game:
        logger.warning(f"Game with id {guess_req.game_id} not found.")
        raise HTTPException(status_code=404, detail="Game not found")
    if game.current_number is None:
        logger.info(f"Game {guess_req.game_id} already finished.")
        return schemas.GuessResponse(correct=False, score=game.score)
    current_number = game.current_number
    new_number = random.randint(0, 1000)
    correct = ((guess_req.guess == 'higher' and new_number > current_number) or
               (guess_req.guess == 'lower' and new_number < current_number))
    game = crud.update_game_after_guess(db, game, correct, new_number if correct else None)
    if correct:
        logger.info(f"Game {guess_req.game_id}: correct guess ({guess_req.guess}), new number {new_number}, score {game.score}.")
        return schemas.GuessResponse(correct=True, new_number=new_number)
    else:
        logger.info(f"Game {guess_req.game_id}: wrong guess ({guess_req.guess}), game over. Final score: {game.score}")
        return schemas.GuessResponse(correct=False, score=game.score)

@app.get("/statistics/{user_id}", response_model=schemas.StatisticsOut)
def get_statistics(user_id: int, db: Session = Depends(database.get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        logger.warning(f"User with id {user_id} not found for statistics.")
        raise HTTPException(status_code=404, detail="User not found")
    stats = crud.get_user_statistics(db, user_id)
    logger.info(f"Statistics for user {user_id}: total_games={stats['total_games']}, longest_streak={stats['longest_streak']}")
    return schemas.StatisticsOut(**stats)

@app.delete("/statistics/{user_id}", response_model=schemas.ClearStatisticsResponse)
def clear_statistics(user_id: int, db: Session = Depends(database.get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        logger.warning(f"User with id {user_id} not found for clearing statistics.")
        raise HTTPException(status_code=404, detail="User not found")
    deleted = crud.clear_user_statistics(db, user_id)
    logger.info(f"Cleared {deleted} games for user {user_id}.")
    return schemas.ClearStatisticsResponse(message=f"Cleared {deleted} games for user {user_id}.")
