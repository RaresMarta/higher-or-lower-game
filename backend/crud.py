from sqlalchemy.orm import Session
import models, schemas
import random

# User CRUD

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Game CRUD

def create_game(db: Session, user_id: int, number: int):
    game = models.Game(user_id=user_id, score=0, current_number=number)
    db.add(game)
    db.commit()
    db.refresh(game)
    return game

def get_game_by_id(db: Session, game_id: int):
    return db.query(models.Game).filter(models.Game.id == game_id).first()

def update_game_after_guess(db: Session, game, correct: bool, new_number: int = None):
    if correct:
        game.score += 1
        game.current_number = new_number
    else:
        game.current_number = None  # Mark game as finished
    db.commit()
    db.refresh(game)
    return game

# Statistics

def get_user_statistics(db: Session, user_id: int):
    games = db.query(models.Game).filter(models.Game.user_id == user_id).all()
    total_games = len(games)
    longest_streak = max((g.score for g in games), default=0)
    return {"total_games": total_games, "longest_streak": longest_streak}

def clear_user_statistics(db: Session, user_id: int):
    deleted = db.query(models.Game).filter(models.Game.user_id == user_id).delete()
    db.commit()
    return deleted
