document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');

    const calculateBtn = document.getElementById('calculateBtn');
    const result = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');

    if (!calculateBtn) {
        console.error('找不到计算按钮元素');
        return;
    }

    console.log('找到计算按钮，添加点击事件...');

    calculateBtn.addEventListener('click', function(e) {
        console.log('按钮被点击了');
        e.preventDefault();
        calculateWatering();
    });

    function calculateWatering() {
        console.log('开始计算浇水需求...');

        // 获取用户输入
        const weather = document.querySelector('input[name="weather"]:checked');
        const temperature = document.getElementById('temperature').value;
        const lastWatering = document.querySelector('input[name="lastWatering"]:checked');

        console.log('获取到的输入：', {
            weather: weather ? weather.value : '未选择',
            temperature: temperature || '未输入',
            lastWatering: lastWatering ? lastWatering.value : '未选择'
        });

        // 验证输入
        if (!weather) {
            console.log('验证失败：未选择天气');
            alert('请选择天气状况！');
            return;
        }

        if (!temperature) {
            console.log('验证失败：未输入气温');
            alert('请输入气温！');
            return;
        }

        if (!lastWatering) {
            console.log('验证失败：未选择上次浇花时间');
            alert('请选择上次浇花时间！');
            return;
        }

        console.log('输入验证通过，开始计算...');

        const temp = parseFloat(temperature);
        const weatherType = weather.value;
        const lastWateringTime = lastWatering.value;

        // 计算浇水需求
        let wateringResult = {
            shouldWater: false,
            times: 0,
            frequency: '',
            description: ''
        };

        if (weatherType === 'rainy') {
            // 下雨：无论气温如何，当天都不浇水
            wateringResult = {
                shouldWater: false,
                times: 0,
                frequency: '今天不用浇水',
                description: '下雨天气，土壤湿润充足，今天不需要给花浇水。'
            };
        } else if (weatherType === 'sunny') {
            // 晴天
            if (temp > 30) {
                wateringResult = {
                    shouldWater: true,
                    times: 2,
                    frequency: '早晚各浇1次（共2次）',
                    description: '晴天高温，水分蒸发快，建议早晚各浇水1次保持土壤湿润。'
                };
            } else if (temp >= 20 && temp <= 30) {
                wateringResult = {
                    shouldWater: true,
                    times: 1,
                    frequency: '早上浇1次',
                    description: '晴天适中温度，早上浇水1次即可满足植物需求。'
                };
            } else { // temp < 20
                if (lastWateringTime === 'yesterday') {
                    wateringResult = {
                        shouldWater: false,
                        times: 0,
                        frequency: '今天不用浇水',
                        description: '昨天已经浇过水，今天可以休息，让土壤适度干燥。'
                    };
                } else { // dayBeforeYesterday
                    wateringResult = {
                        shouldWater: true,
                        times: 1,
                        frequency: '浇1次',
                        description: '前天浇过水，土壤较干燥，今天需要浇水1次。'
                    };
                }
            }
        } else if (weatherType === 'cloudy') {
            // 阴天
            if (temp > 30) {
                wateringResult = {
                    shouldWater: true,
                    times: 1,
                    frequency: '浇1次',
                    description: '阴天但气温较高，需要适量浇水1次。'
                };
            } else { // temp <= 30
                if (lastWateringTime === 'yesterday') {
                    wateringResult = {
                        shouldWater: false,
                        times: 0,
                        frequency: '今天不用浇水',
                        description: '阴天温度适中，昨天刚浇过水，今天不需要浇水。'
                    };
                } else { // dayBeforeYesterday
                    wateringResult = {
                        shouldWater: true,
                        times: 1,
                        frequency: '浇1次',
                        description: '阴天温度适中，前天浇过水，今天需要浇水1次。'
                    };
                }
            }
        }

        console.log('计算结果：', wateringResult);

        // 显示结果
        displayResult(wateringResult, weatherType, temp, lastWateringTime);
    }

    function displayResult(result, weather, temp, lastWatering) {
        const weatherEmoji = {
            'sunny': '☀️',
            'cloudy': '☁️',
            'rainy': '🌧️'
        };

        const weatherText = {
            'sunny': '晴天',
            'cloudy': '阴天',
            'rainy': '下雨'
        };

        const lastWateringText = {
            'yesterday': '昨天',
            'dayBeforeYesterday': '前天'
        };

        let html = '';

        // 添加表情符号
        if (result.times === 0) {
            html += '<span class="emoji">🚫💧</span>';
        } else if (result.times === 1) {
            html += '<span class="emoji">💧</span>';
        } else {
            html += '<span class="emoji">💧💧</span>';
        }

        // 天气信息
        html += `<div><strong>当前条件：</strong>${weatherEmoji[weather]} ${weatherText[weather]}，${temp}°C，上次浇花：${lastWateringText[lastWatering]}</div>`;

        // 浇水建议
        html += `<div class="water-times">${result.frequency}</div>`;

        // 详细说明
        html += `<div>${result.description}</div>`;

        // 如果需要浇水，添加提醒
        if (result.shouldWater) {
            html += '<div style="margin-top: 12px; color: #27ae60; font-weight: 600;">✓ 今天记得给花浇水哦！</div>';
        } else {
            html += '<div style="margin-top: 12px; color: #95a5a6;">✓ 今天可以不用浇水，植物会感谢你的！</div>';
        }

        resultContent.innerHTML = html;
        result.classList.remove('hidden');

        // 滚动到结果区域
        result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // 添加回车键支持
    document.getElementById('temperature').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateWatering();
        }
    });

    // 为所有单选按钮添加回车键支持
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.checked = true;
                calculateWatering();
            }
        });
    });
});