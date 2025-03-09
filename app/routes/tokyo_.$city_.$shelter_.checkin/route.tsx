import { useState } from 'react';

const Dashboard = () => {
    const [allDeviceInfo, setAllDeviceInfo] = useState<any[]>([]);
    const [latestInfo, setLatestInfo] = useState<any | null>(null);
    const [isSent, setIsSent] = useState(false);  // 送信状態を管理

    const generateRandomMyNumberID = () => {
        const firstDigit = Math.floor(Math.random() * 9) + 1; 
        const remainingDigits = Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('');
        return `${firstDigit}${remainingDigits}`;
    };
    
    const generateRandomFamilyIDs = (count) => {
        const familyIDs = [];
        for (let i = 0; i < count; i++) {
            familyIDs.push(generateRandomMyNumberID()); // 生成したIDを追加
        }
        return familyIDs;
    };
    
    const handleClick = async () => {
        const mockMyNumberID = generateRandomMyNumberID();  // ランダムなマイナンバーIDを生成
        const mockFullName = "赤司ひかる";  
        const mockBirthDate = "1990-01-01";  
        const mockGender = "M";  
        const mockFamilyIDs = generateRandomFamilyIDs(2);  // 2つのランダムな家族マイナンバーIDを生成
    
        try {
            const postResponse = await fetch('http://localhost:8000/ble/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    my_number_id: mockMyNumberID,
                    full_name: mockFullName,
                    birth_date: mockBirthDate,
                    gender: mockGender,
                    family_my_number_ids: mockFamilyIDs,
                }),
            });
    
            if (!postResponse.ok) {
                throw new Error('サーバーエラー: ' + postResponse.statusText);
            }
    
            const getResponse = await fetch('http://localhost:8000/ble/');
            if (!getResponse.ok) {
                throw new Error('GETリクエストエラー: ' + getResponse.statusText);
            }
            const data = await getResponse.json();
            console.log('GET Response Data:', data);

            setAllDeviceInfo(data);  
            setLatestInfo(data[0]);  
            setIsSent(true);  // 送信後に画面を切り替える
        } catch (error) {
            console.error('エラー:', error);
        }
    };

    const handleReset = () => {
        setIsSent(false);
        setLatestInfo(null);
        setAllDeviceInfo([]);
    };

    return (
        <div style={styles.dashboard}>
            {/* 最初の画面 */}
            {!isSent && (
                <div style={styles.initialScreen}>
                    <button style={styles.largeButton} onClick={handleClick}>
                        BLEデータを送信
                    </button>
                </div>
            )}

            {/* データ送信後の画面 */}
            {isSent && (
                <div style={styles.content}>
                    <div style={styles.header}>
                        <h1 style={styles.blueText}>みえるーむ</h1>
                        <p style={styles.blueText}>{new Date().toLocaleString()}</p>
                    </div>

                    <div style={styles.gridContainer}>
                        {/* 最新チェックイン */}
                        {latestInfo && (
                            <div style={styles.latestCheckin}>
                                <h2 style={styles.blueText}>最新チェックイン</h2>
                                <div style={styles.card}>
                                    <p><strong>{latestInfo.full_name}</strong></p>
                                    <p>年齢: {new Date().getFullYear() - new Date(latestInfo.birth_date).getFullYear()}歳</p>
                                    <p>チェックイン時間: {new Date().toLocaleString()}</p>
                                    <p>性別: {latestInfo.gender}</p>
                                </div>
                            </div>
                        )}

                        {/* 避難所統計 */}
                        <div style={styles.statistics}>
                            <h2 style={styles.blueText}>避難所統計</h2>
                            <p>総避難者数: {allDeviceInfo.length}</p>
                            <p>要配慮者数: 2</p>
                        </div>

                        {/* チェックイン履歴 */}
                        <div style={styles.history}>
                            <h2 style={styles.blueText}>チェックイン履歴</h2>
                            <ul>
                                {allDeviceInfo.map((device, index) => (
                                    <li key={index} style={styles.historyItem}>
                                        <p>{device.full_name}</p>
                                        <p>{new Date().getFullYear() - new Date(device.birth_date).getFullYear()}歳</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <button style={styles.completeButton} onClick={handleReset}>
                        完了
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

// スタイルをオブジェクトとして定義
const styles = {
    dashboard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f4f8',
        minHeight: '100vh',
    },
    initialScreen: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',  // 画面中央に配置
    },
    largeButton: {
        padding: '20px 40px',
        fontSize: '2rem',
        backgroundColor: '#007acc',
        color: '#fff',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    blueText: {
        color: '#007acc',  // 青色
    },
    content: {
        width: '100%',
        maxWidth: '1200px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',  // 横方向に中央揃え
        justifyContent: 'center',  // 縦方向に中央揃え
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',  // 3つのカラムでレイアウト
        gap: '20px',
        marginTop: '20px',
        width: '100%',  // グリッドを全幅に広げる
    },
    latestCheckin: {
        gridColumn: 'span 2',  // 2カラム分を占有
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        color: '#333',  // 文字色を濃いグレーに変更
    },
    statistics: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        color: '#333',  // 文字色を濃いグレーに変更
    },
    history: {
        gridColumn: 'span 3',  // 3カラム分を占有
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px',
        color: '#333',  // 文字色を濃いグレーに変更
    },
    card: {
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        color: '#333',  // 文字色を濃いグレーに変更
    },
    historyItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        borderBottom: '1px solid #ccc',
        color: '#333',  // 文字色を濃いグレーに変更
    },
    completeButton: {
        marginTop: '30px',
        padding: '15px 30px',
        fontSize: '1.5rem',
        backgroundColor: '#007acc',
        color: '#fff',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        alignSelf: 'center',  // 自分自身を中央に配置
    },
};
