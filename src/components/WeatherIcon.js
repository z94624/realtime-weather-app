import React, { useMemo } from 'react';
import styled from '@emotion/styled';

import { ReactComponent as DayCloudy } from './../images/day-cloudy.svg';
import { ReactComponent as DayThunderstorm } from './../images/day-thunderstorm.svg';
import { ReactComponent as DayClear } from './../images/day-clear.svg';
import { ReactComponent as DayCloudyFog } from './../images/day-cloudy-fog.svg';
import { ReactComponent as DayFog } from './../images/day-fog.svg';
import { ReactComponent as DayPartiallyClearWithRain } from './../images/day-partially-clear-with-rain.svg';
import { ReactComponent as DaySnowing } from './../images/day-snowing.svg';

import { ReactComponent as NightThunderstorm } from './../images/night-thunderstorm.svg';
import { ReactComponent as NightClear } from './../images/night-clear.svg';
import { ReactComponent as NightCloudyFog } from './../images/night-cloudy-fog.svg';
import { ReactComponent as NightCloudy } from './../images/night-cloudy.svg';
import { ReactComponent as NightFog } from './../images/night-fog.svg';
import { ReactComponent as NightPartiallyClearWithRain } from './../images/night-partially-clear-with-rain.svg';
import { ReactComponent as NightSnowing } from './../images/night-snowing.svg';
// 天氣型態(Weather Type) 對應的 天氣代碼(Weather Code)
const weatherTypes = {
	isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
	isClear: [1],
	isCloudyFog: [25, 26, 27, 28],
	isCloudy: [2, 3, 4, 5, 6, 7],
	isFog: [24],
	isPartiallyClearWithRain: [8, 9, 10, 11, 12, 13, 14, 19, 20, 29, 30, 31, 32, 38, 39],
	isSnowing: [23, 37, 42]
}
// 天氣型態(Weather Type) 對應的 天氣圖示(Weather Icon)
const weatherIcons = {
	day: {
		isThunderstorm: <DayThunderstorm />,
		isClear: <DayClear />,
		isCloudyFog: <DayCloudyFog />,
		isCloudy: <DayCloudy />,
		isFog: <DayFog />,
		isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
		isSnowing: <DaySnowing />
	},
	night: {
		isThunderstorm: <NightThunderstorm />,
		isClear: <NightClear />,
		isCloudyFog: <NightCloudyFog />,
		isCloudy: <NightCloudy />,
		isFog: <NightFog />,
		isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
		isSnowing: <NightSnowing />
	}
}
// 找出天氣代碼所對應的天氣型態
const weatherCode2Type = weatherCode => {
	// EX: ['isClear', [1]] 利用陣列解構賦值取出天氣型態
	const [weatherType] = Object.entries(weatherTypes).find(
		([weatherType, weatherCodes]) => 
			weatherCodes.includes(Number(weatherCode))
		) || [];
	return weatherType;
}
// 外圍包一層 DIV
const IconContainer = styled.div`
	flex-basis: 30%;
	svg {
		max-height: 110px;
	}
`;
// 只要元件的資料狀態有改變，不論是該元件本身的 state、或是父層元件傳入的 props，都會觸發該元件重新轉譯
const WeatherIcon = ({ weatherCode, moment }) => {
	// 這樣會 weatherCode 沒變，但 moment 或其他 state 有變，還需要呼叫一次該方法
	/*const weatherType = weatherCode2Type(weatherCode);*/
	/*
	 * useMemo 似 useCallback 都是效能優化方法
	 * useMemo 回傳一個計算好的值；useCallback 回傳一個函式
	 * useMemo 的 dependencies array 中的變數沒有改變的話，函式不會執行
	 */
	const weatherType = useMemo(() => weatherCode2Type(weatherCode), [weatherCode]);
	const weatherIcon = weatherIcons[moment][weatherType];

	return (
		<IconContainer>{weatherIcon}</IconContainer>
	)
}

export default WeatherIcon;