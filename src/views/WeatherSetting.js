import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { availableLocations } from './../utils/helpers.js';

const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledSelect = styled.select`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-shadow: none;
  outline: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;
    font-size: 14px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;

const WeatherSetting = ({ cityName, handleCurrentPageChange, handleCurrentCityChange }) => {
    /*
     * Controlled Components，表單的 input(type="file") 才用 Uncontrolled Components 搭配 useRef 這個 React Hooks
     * useRef 取得的物件，不受 React 元件重新轉譯影響，也不會觸發 React 元件重新轉譯
     * 在 HTML 元素上使用 ref 屬性，並把 useRef 回傳的物件放進去。 [物件].current 就可以指稱到該元素 = document.querySelector()
     * 因為瀏覽器本身已經有 window.location 物件，所以不取名為 location
     * 在 StyledSelect 新增 value 以同步畫面與 state
     */
    const [locationName, setLocationName] = useState(cityName);
    // 使用者輸入的內容更新到 React 內的資料狀態 locationName
    const handleChange = e => {
        console.log(e.target.value);
        setLocationName(e.target.value);
    }
    // 儲存按鈕反應
    const handleSave = () => {
        console.log(`儲存的地區資訊為：${locationName}`);
        //console.log('value', inputLocationRef.current.value);
        handleCurrentCityChange(locationName); // 更新 App 元件中的 currentCity
        handleCurrentPageChange('WeatherCard'); // 切換回 WeatherCard 頁面
        /*
         * localStorage 是瀏覽器提供給各網站的一個儲存空間
         * >>> Browser > Application > Local Storage
         * setItem(keyName, keyValue) / getItem(keyName) / removeItem(keyName) / clear()
         */
        localStorage.setItem('cityName', locationName);
    }
    /*
     * Uncontrolled Components
     */
    //const inputLocationRef = useRef(null);

    return (
        <WeatherSettingWrapper>
            <Title>設定</Title>
            {/* 避免 HTML label 的 for 屬性與 JS 的 for 衝突 */}
            <StyledLabel htmlFor="location">地區</StyledLabel>

            <StyledSelect id="location" name="location"
              onChange={handleChange} value={locationName}
              //ref={inputLocationRef} defaultValue="臺南市"
            >
                {/* 定義可以選擇的地區選項 */}
                {availableLocations.map(({ cityName }) => (
                    <option value={cityName} key={cityName}>
                        {cityName}
                    </option>
                ))}
            </StyledSelect>

            <ButtonGroup>
                <Back onClick={() => handleCurrentPageChange('WeatherCard')}>返回</Back>
                <Save onClick={handleSave}>儲存</Save>
            </ButtonGroup>
        </WeatherSettingWrapper>
    );
}

export default WeatherSetting;