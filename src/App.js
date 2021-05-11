import React, { useState, useEffect, useCallback, useMemo } from 'react';
/*
 * CSS-in-JS
 * >>> npm install --save @emotion/core @emotion/styled
 */
import styled from '@emotion/styled';
/*
 * >>> npm install --save emotion-theming
 */
import { useTheme, ThemeProvider, withTheme } from '@emotion/react';
// 取得某一地區現在是白天或晚上
import { getMoment, findLocation } from './utils/helpers.js';
// 元件拆分後匯入
import WeatherCard from './views/WeatherCard.js'
// 把拉取天氣資料的一整個流程包成 Custom Hook
import useWeatherAPI from './hooks/useWeatherAPI.js';
// 天氣設定頁面
import WeatherSetting from './views/WeatherSetting.js';
// 定義帶有 styled 的 component
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
// 定義深色主題的配色
const theme = {
    light: {
        backgroundColor: '#ededed',
        foregroundColor: '#f9f9f9',
        boxShadow: '0 1px 3px 0 #999999',
        titleColor: '#212121',
        temperatureColor: '#757575',
        textColor: '#828282'
    },
    dark: {
        backgroundColor: '#1F2022',
        foregroundColor: '#121416',
        boxShadow: '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
        titleColor: '#f9f9fa',
        temperatureColor: '#dddddd',
        textColor: '#cccccc'
    }
}
// 中央氣象局授權碼
const AUTHORIZATION_KEY = 'CWB-4283401A-944D-4438-8536-496A9B30EB41';
// 天氣觀測用局屬觀測站
/*const LOCATION_NAME = '臺北';*/
// 天氣預報用縣市名稱
/*const LOCATION_NAME_FORECAST = '臺北市';*/
// 把定義好的 styled-component 當成元件使用
const App = () => {
    const [ currentTheme, setCurrentTheme ] = useState('light');

    // 從 localStorage 取出先前保存的地區
    const storageCity = localStorage.getItem('cityName') || '臺北市';
    // 定義當前要拉取天氣資訊的地區
    const [currentCity, setCurrentCity] = useState(storageCity);
    // currentCity 沒有改變時，即使元件重新轉譯，也不會重新取值
    const currentLocation = useMemo(() => findLocation(currentCity), [currentCity]);
    const {cityName, locationName, sunriseCityName} = currentLocation;
    const handleCurrentCityChange = currentCity => {
        setCurrentCity(currentCity);
    }

    // 使用 useWeatherAPI
    const [ weatherElement, fetchData ] = useWeatherAPI({
        locationName: locationName,
        cityName: cityName,
        authorizationKey: AUTHORIZATION_KEY
    });

    // 當前地點所處時間為白天或晚上
    const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);
    /*
     * 根據 moment 決定亮暗色主題
     * 另外一種設計：提供按鈕切換
     */
    useEffect(() => {
        setCurrentTheme(moment === 'day' ? 'light' : 'dark');
    }, [moment]);

    // 切換頁面
    const [currentPage, setCurrentPage] = useState('WeatherCard');
    // 為了讓子層元件(WeatherCard.js/WeatherSetting.js)藉由該方法改變父層元件(App.js)資料狀態
    const handleCurrentPageChange = (currentPage) => {
        setCurrentPage(currentPage);
    }

    return (
        // 把所有會用到的主題配色包在 ThemeProvider 內，透過 theme 這個 props 傳入深色主題
        <ThemeProvider theme={theme[currentTheme]}>
            <Container>
                {/* 利用條件轉譯決定要呈現哪個元件，進階套件可用 "react-router" */}
                {currentPage === 'WeatherCard' && (
                    <WeatherCard
                        cityName={cityName}
                        weatherElement={weatherElement}
                        moment={moment}
                        fetchData={fetchData}
                        handleCurrentPageChange={handleCurrentPageChange}
                    />
                )}
                {currentPage === 'WeatherSetting' && (
                    <WeatherSetting
                        cityName={cityName}
                        handleCurrentPageChange={handleCurrentPageChange}
                        handleCurrentCityChange={handleCurrentCityChange}
                    />
                )}
            </Container>
        </ThemeProvider>
    );
}

export default App;
