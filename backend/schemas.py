from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    pass

class UserOut(UserBase):
    id: int
    class Config:
        orm_mode = True

class GameOut(BaseModel):
    id: int
    score: int
    class Config:
        orm_mode = True

class GameStartResponse(BaseModel):
    game_id: int
    number: int

class GuessRequest(BaseModel):
    game_id: int
    guess: str  # 'higher' or 'lower'

class GuessResponse(BaseModel):
    correct: bool
    new_number: Optional[int] = None
    score: Optional[int] = None

class StatisticsOut(BaseModel):
    total_games: int
    longest_streak: int

class ClearStatisticsResponse(BaseModel):
    message: str