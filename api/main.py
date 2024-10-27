from fastapi import FastAPI
from api.evacuee_service import routers as evacuee_routers
from api.shelter_service import routers as shelter_routers
from api.supplies_service import routers as supplies_routers
from api.ble_device_service import routers as ble_device_routers
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ルーターの登録
# CORSを許可する設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 許可するオリジン
    allow_credentials=True,
    allow_methods=["*"],  # 許可するHTTPメソッド
    allow_headers=["*"],  # 許可するHTTPヘッダー
)

app.include_router(evacuee_routers.router)
app.include_router(shelter_routers.router)
app.include_router(supplies_routers.router)
app.include_router(ble_device_routers.router)  # ble ルーターを FastAPI アプリケーションに登録

@app.get("/")
def read_root():
    return {"Hello": "World"}
