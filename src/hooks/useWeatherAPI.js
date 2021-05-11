// 在 Custom Hooks 中因為最後不會回傳 JSX，所以不需要載入 react 套件提供的 React 物件
import { useState, useEffect, useCallback } from 'react';

/*
 * 重點：
 * 當 function 不依賴 state 時，可以將 function 定義在 App 元件外
 * 此例：不依賴 weatherElement 或 setWeatherElements
 */
// 點擊重新整理圖示：向中央氣象局請求資料
const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
    // 直接把 fetch API 回傳的 Promise 再回傳出去
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`) // 使用瀏覽器原生的 fetch API 發送請求
    .then(response => response.json()) // 取得伺服器回傳的資料並以 JSON 解析
    .then(data => { // 取得解析後的 JSON 資料
        const locationData = data.records.location[0]; // 測站觀測資料
        // 取得 風速 與 溫度 資料
        const weatherElements = locationData.weatherElement.reduce(
            (neededElements, item) => {
                if (['WDSD', 'TEMP'].includes(item.elementName)) {
                    neededElements[item.elementName] = item.elementValue;
                }
                return neededElements;
            }, {}
        );
        /*
         * 將取得的新資料更新至 React 元件
         * setSomething 方法會完全以傳入的值覆蓋掉舊有內容
         * 若只更新物件中某元素，其他元素利用解構賦值方式即可(元素後的註解)
         */
        /*setWeatherElement(prevState => ({
            ...prevState,
            observationTime: locationData.time.obsTime,
            locationName: locationData.locationName,
            temperature: weatherElements.TEMP,
            windSpeed: weatherElements.WDSD,

            isLoading: false // 天氣資料抓取完畢
        }));*/
        // 把取得的資料回傳出去，非在此 setWeatherElement
        return {
            observationTime: locationData.time.obsTime,
            locationName: locationData.locationName,
            temperature: weatherElements.TEMP,
            windSpeed: weatherElements.WDSD,
        }
    });
}
// 請求 天氣預報 資料
const fetchWeatherForecast = ({ authorizationKey, cityName }) => {
    // 直接把 fetch API 回傳的 Promise 再回傳出去
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`)
    .then(response => response.json())
    .then(data => {
        const locationData = data.records.location[0];
        // 取得 天氣現象、降雨機率、舒適度 資料
        const weatherElements = locationData.weatherElement.reduce(
            (neededElements, item) => {
                if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
                    // 這支 API 會回傳未來 36 小時的資料，在此只需取最近 12 小時資料
                    neededElements[item.elementName] = item.time[0].parameter;
                }
                return neededElements;
            }, {}
        );

        /*setWeatherElement(prevState => ({
            ...prevState,
            description: weatherElements.Wx.parameterName,
            weatherCode: weatherElements.Wx.parameterValue,
            rainPossibility: weatherElements.PoP.parameterName,
            comfortability: weatherElements.CI.parameterName
        }));*/
        // 把取得的資料回傳出去，非在此 setWeatherElement
        return {
            description: weatherElements.Wx.parameterName,
            weatherCode: weatherElements.Wx.parameterValue,
            rainPossibility: weatherElements.PoP.parameterName,
            comfortability: weatherElements.CI.parameterName
        }
    });
}

const useWeatherAPI = ({ locationName, cityName, authorizationKey }) => {
	// 定義會使用到的資料狀態
    const [weatherElement, setWeatherElement] = useState({
        observationTime: new Date(),
        locationName: '',
        temperature: 0,
        windSpeed: 0,
        description: '',
        weatherCode: 0,
        rainPossibility: 0,
        comfortability: '',
        isLoading: true // 天氣資料載入中狀態
    });
    /*
     * 定義 async function
     * 當函式不需要共用時，可以直接定義在 useEffect 內
     * 相反地，當函式需要共用時，可以拉到 useEffect 外
     * 使用 useCallback 把 fetchData 函式保存下來，而不因元件重新轉譯變成新函式
     * useCallback: 第二參數一樣是 dependencies 陣列，只有在改變時，才會回傳一個新函式
     * => 使用時機：當 useEffect 的 dependencies 相依於某函式時，可透過 useCallback 把函式保存下來，避免元件重新轉譯為新函式，導致 useEffect 每次都會重新執行。
     */
    const fetchData = useCallback(async () => {
        // 資料請求前
        setWeatherElement(prevState => ({
            ...prevState,
            isLoading: true
        }));
        // 等待倆 API 都取得回應後才繼續
        const [currentWeather, weatherForcast] = await Promise.all([
            fetchCurrentWeather({ authorizationKey, locationName }),
            fetchWeatherForecast({ authorizationKey, cityName })
        ]);
        // 取得的資料透過物件的解構賦值放入
        setWeatherElement({
            ...currentWeather,
            ...weatherForcast,
            isLoading: false
        });
    }, [locationName, cityName, authorizationKey]);
    /* 
     * useEffect 的參數需帶入函式，該函式在"畫面轉譯完成"後被呼叫，像元件的 callback func.
     * effect = "副作用"簡稱
     */
    useEffect(() => {
        /* 
         * 避免陷入無限迴圈(setWeatherElement() 會重新轉譯畫面)，需要第二參數(dependencies)
         * dependencies: 此陣列內的元素沒有改變，useEffect 的函式就不會被執行
         * = 元件轉譯完後，如果 dependencies 有改變，才會呼叫 useEffect 內的 function
         * 帶入空陣列就永遠也不會改變，所以只有在頁面載入時才會執行
         */
        /*fetchCurrentWeather();
        fetchWeatherForecast();*/
        fetchData();
    }, [fetchData]);
    // 同 React Hooks，回傳要讓其他元件使用的資料與方法
    return [weatherElement, fetchData];
};

export default useWeatherAPI;