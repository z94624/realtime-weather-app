// 漢一整個頁面有關的內容會放在 views/ 資料夾
import React from 'react';
import styled from '@emotion/styled';
/*
 * dayjs 處理跨瀏覽器時間問題
 * >>> npm install --save dayjs
 */
import dayjs from 'dayjs';
/*
 * 載入 SVG 圖示
 * >>> 使用 create-react-app 建立的專案才可使用元件 ReactComponent
 */
import { ReactComponent as RainIcon } from './../images/rain.svg';
import { ReactComponent as AirFlowIcon } from './../images/airFlow.svg';
import { ReactComponent as RefreshIcon } from './../images/refresh.svg';
import { ReactComponent as LoadingIcon } from './../images/loading.svg';
import { ReactComponent as CogIcon } from './../images/cog.svg';
/*
 * 原本的 CloudyIcon 改成外部元件 ./components/WeatherIcon.js
 */
import WeatherIcon from './../components/WeatherIcon.js';

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;
const Location = styled.div`
  font-size: 36px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 10px;
`;
const Description = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
`;
const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 20px;
`;
const Temperature = styled.div`
  color: ${({ theme, degree }) => {
    if (degree >= 36) {return theme.temperatureColorHot;}
    else if (degree > 10 && degree < 36) {return theme.temperatureColor;}
    else if (degree <= 10) {return theme.temperatureColorFreeze;}
  }};
  font-size: 120px;
  font-weight: 1000;
  display: flex;
`;
const Celsius = styled.div`
  font-weight: normal;
  font-size: 40px;
`;
/*
 * 對特定元件調整樣式
 */
const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 10px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;
const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;
/*const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;*/
const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};

  @keyframes rotate {
    from {
        transform: rotate(360deg);
    }
    to {
        transform: rotate(0deg);
    }
  }

  svg {
    margin-left: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    /* 定義旋轉動畫效果 */
    animation: rotate infinite 1.5s linear;
    /* 載入中圖示才套用旋轉效果 */
    animation-duration: ${({isLoading}) => (isLoading ? '1.5s' : '0s')};
  }
`;
/*
 * 對元件新增樣式 styled(Component) 為新元件
 * 齒輪 = 設定頁按鈕
 */
const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const WeatherCard = ({cityName, weatherElement, moment, fetchData, handleCurrentPageChange}) => {
	// 利用物件的解構賦值將資料取出
    const {
        observationTime,
        //locationName,
        description,
        windSpeed,
        temperature,
        rainPossibility,
        comfortability,
        isLoading,
        weatherCode
    } = weatherElement;
	
	return (
		<WeatherCardWrapper>
            <Cog onClick={() => handleCurrentPageChange('WeatherSetting')} />
            <Location>{cityName}</Location>
            <Description>{description} {comfortability}</Description>
            <CurrentWeather>
                <Temperature degree={Math.round(temperature)}>
                    {Math.round(temperature)} <Celsius>°C</Celsius>
                </Temperature>
                {/* 使用 WeatherIcon 元件 */}
                <WeatherIcon weatherCode={weatherCode} moment={moment} />
            </CurrentWeather>
            <AirFlow>
                <AirFlowIcon />{windSpeed} m/h
            </AirFlow>
            <Rain>
                <RainIcon />{rainPossibility} % 
            </Rain>
            <Refresh onClick={fetchData} isLoading={isLoading}>
                最後觀測時間：
                {/*
                  * 使用瀏覽器原生 Intl(Internationalization API)
                  * 針對日期、時間、數字(貨幣)等資料進行多語系呈現處理
                  * 第二參數：以數值呈現 時 與 分
                  */}
                {new Intl.DateTimeFormat('zh-TW', {
                    hour: 'numeric',
                    minute: 'numeric'
                }).format(new dayjs(observationTime))}
                {/* 帶入空格，因為 React 會自動濾掉空格 */}
                {' '}
                {/*
                  * 條件轉譯：載入中用載入圖示，讀取完成用重整圖示
                  * Chrome > Network > No Throttling 改成 Slow 3G 將網速降低
                  */}
                {isLoading ? <LoadingIcon /> : <RefreshIcon />}
            </Refresh>
        </WeatherCardWrapper>
	);
}

export default WeatherCard;