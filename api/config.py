from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    db_host: str = "aws-0-ap-northeast-1.pooler.supabase.com"
    db_port: str = "6543"
    db_user: str = "postgres.tkerestuuijnvrqtzvrs"
    db_name: str = "postgres"
    db_password: str = "c3M9gkUFHBYy"

    class Config:
        env_file = ".env"

settings = Settings()
