<style>
  h1 {
      color: #007acc; /* 青色 */
      font-size: 2rem;
  }
  
  h2 {
      color: #005999; /* ダークブルー */
      font-size: 1.5rem;
  }

  p {
      color: #333; /* 濃いグレー */
      font-size: 1rem;
      line-height: 1.5;
  }

  ul {
      list-style-type: disc;
      margin-left: 20px;
  }

  li {
      margin-bottom: 10px;
  }
</style>

# BLEにおけるUUIDの設定と管理

## 1. UUIDの定義
- **UUID（ユニバーサルユニークID）**は、BLEデバイスが提供するサービスやキャラクタリスティックを識別するための一意の識別子です。

## 2. セントラルとペリフェラル
- **セントラル（Central）**: BLE通信を行う際、データを要求する側。通常はスマートフォンやPCなど、デバイスを制御する役割を持ちます。
  
- **ペリフェラル（Peripheral）**: BLE通信を行う際、データを提供する側。センサーやデバイスなど、情報を送信する役割を持ちます。

## 3. UUIDの設定に関する「できること」と「できないこと」

### できること
- **事前にUUIDを登録すること**:
  - BLEデバイス側では、特定のサービスやキャラクタリスティックに対してUUIDを事前に設定・登録しておくことができます。
  
- **UUIDを使用してデータを識別**:
  - 接続後、PC（セントラル側）からUUIDを使って特定のデータやサービスにアクセスできます。

- **UUIDのカスタマイズ**:
  - 開発者は、デバイスの用途に応じて独自のUUIDを定義し、BLEデバイスに組み込むことができます。

### できないこと
- **UUIDの動的変更**:
  - 一度設定したUUIDは、デバイスが動作中に変更することはできません。UUIDはデバイスのファームウェアにハードコーディングされていることが多いです。

- **PC（セントラル側）からUUIDを設定すること**:
  - UUIDはモバイルデバイスやセンサー（ペリフェラル側）で設定されるため、PC側がUUIDを変更または設定することはできません。

- **UUIDなしでの接続**:
  - BLEデバイスに接続するには、UUIDを用いてサービスを識別する必要があります。UUIDが未設定の場合、デバイスは正しく機能しません。

## 4. 接続フローの例
1. **モバイルデバイス（ペリフェラル側）**:
   - UUIDを設定してBLEサービスを提供。
   - 例: 温度センサーのサービスUUIDを設定。

2. **PC（セントラル側）**:
   - BLEデバイスに接続し、提供されるサービスやキャラクタリスティックのUUIDを確認。
   - 取得したUUIDを使用して、デバイスからデータを取得。

## まとめ
- UUIDはBLEデバイス（ペリフェラル側）で設定され、PC（セントラル側）では接続後に取得されます。
- PCはUUIDを使用して、デバイスから特定のサービスやデータにアクセスします。
- UUIDは事前に登録が必要で、設定後に変更することはできません。