/* icons为预先准备好的图标100个
 size为每页显示的个数
 page是显示的总页数 向上取整(一个也会占一页)
 pagerCount为要显示的数字按钮的个数 */  
 
//  main.js
import  alldata  from './data.js';//获取data.js中的data数据
// const alldata =require('./data.js')
console.log(alldata);

// const alldata = {
//     "data": [
//         {
//             "id": 1,
//             "customer_name": "test",
//             "material_supplier": "123",
//             "material_name": "456",
//             "total_stocking_quantity": 7300,
//             "total_forSale_quantity": 2600,
//             "extra": "",
//             "createdAt": "2025-05-10",
//             "updatedAt": "2025-05-10 21:19:16"
//         },
//         {
//             "id": 2,
//             "customer_name": "test",
//             "material_supplier": "789",
//             "material_name": "456",
//             "total_stocking_quantity": 200,
//             "total_forSale_quantity": 0,
//             "extra": "",
//             "createdAt": "2025-05-10",
//             "updatedAt": "2025-05-10"
//         }
//     ]
// };

document.addEventListener('DOMContentLoaded', () => {
    console.log(alldata);
    // document.getElementById('responseContainer').textContent = JSON.stringify(alldate, null, 2);//打印并显示
});
 
 const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;



const icons = [
		"pregnant_woman",
		"accessibility",
		"accessibility_new",
		"emoji_people",
		"sports_kabaddi",
		"sports_handball",
		"elderly",
		"accessible",
		"accessible_forward",
		"hotel",
		"sports_baseball",
		"sports_basketball",
		"sports_football",
		"sports_golf",
		"sports_hockey",
		"sports_motorsports",
		"sports_rugby",
		"sports_soccer",
		"sports_tennis",
		"sports_volleyball",
		"pedal_bike",
		"moped",
		"two_wheeler",
		"directions_car",
		"local_taxi",
		"local_shipping",
		"directions_bus",
		"directions_transit",
		"subway",
		"flight",
		"mouse",
		"keyboard",
		"headset",
		"desktop_mac",
		"sim_card",
		"phone_android",
		"phone_iphone",
		"watch",
		"videogame_asset",
		"scanner",
		"attach_email",
		"attachment",
		"cloud_circle",
		"cloud_download",
		"cloud_upload",
		"text_snippet",
		"request_quote",
		"folder",
		"topic",
		"folder_shared",
		"4k",
		"fiber_new",
		"fiber_dvr",
		"explicit",
		"closed_caption",
		"hd",
		"high_quality",
		"closed_caption_disabled",
		"score",
		"picture_as_pdf",
		"filter_1",
		"filter_2",
		"filter_3",
		"filter_4",
		"filter_5",
		"filter_6",
		"filter_7",
		"filter_8",
		"filter_9",
		"filter_9_plus",
		"looks_one",
		"looks_two",
		"looks_3",
		"looks_4",
		"looks_5",
		"exposure_neg_1",
		"exposure_neg_2",
		"exposure_zero",
		"exposure_plus_1",
		"exposure_plus_2",
		"camera_alt",
		"center_focus_strong",
		"camera",
		"camera_roll",
		"photo",
		"movie_creation",
		"motion_photos_on",
		"motion_photos_paused",
		"local_movies",
		"movie_filter",
		"arrow_forward",
		"arrow_back",
		"subdirectory_arrow_right",
		"subdirectory_arrow_left",
		"arrow_downward",
		"arrow_upward",
		"north_east",
		"north_west",
		"south_east",
		"south_west",
	]

	function Icon(id, name, iconClass) {
		this.id = id;
		this.name = name;
		this.iconClass = iconClass;
	  }
	  
	  // 初始化100个结构体
	  const icons_1 = [];
	  for (let i = 0; i < 100; i++) {
		icons_1.push(new Icon(i + 1, `产品 ${i + 1}`, icons[i]));
	  }

function addLinkToList(li, url) {
	const anchor = document.createElement('a');
	anchor.href = url;
	li.appendChild(anchor);
}


	let size = 40,page = Math.ceil(alldata.data.length / size),//元素数量除以每页图标个数，每页显示的图标数量

	//page = Math.ceil(alldata.data.length / size),//元素数量除以每页图标个数，每页显示的图标数量
	 pagerCount = 8;

// 当前选中的页数
let current = 1;

// 显示内容列表
const _content = document.querySelector(".content");
const showContent = () => {
	// 每次遍历新内容 首先清空
	_content.innerHTML = "";
	alldata.data.forEach((item, index) => {
		// 遍历计算方法 当前为第1页 一页10个 第一页的数据就是 0 - 10(不包含) 第二页为 10 - 20(不包含) 以此类推
		if (index >= (current - 1) * size && index < current * size) {
			// 每遍历一个创建一个li元素
			const li = document.createElement("li");

			
			// li元素添加内容
			li.innerHTML = `<a href = 'table.html'>
			//<p>${item.material_name}</p>
			// 		<p>${item.total_stocking_quantity}</p>
					<p>${item.material_name}</p>



					</a>`
					.trim();
			// // 添加到列表元素中							<p>${item.id}</p>
		
						    // <i class="material-icons">${item.iconClass}</i>	

			//addLinkToList(li, url);
			_content.appendChild(li);
		}
	});
};

// 创建分页列表
const _pagination = document.querySelector(".pagination");
const createPagination = () => {
	showContent();

	// 刚开始就要有左按钮
	// 当前页数不为1就为可点击态
	let lis = `
	<li class="material-icons page-btn page-btn-prev ${
		current !== 1 ? "isClick" : ""
	}">
	  keyboard_arrow_left
  </li>`;

	if (current < 1 || current > page) {
		throw `current 参数最小值为1 最大值为${page}`;
		// 当当前页数小于1或者大于总页数了就抛出错误
	} else if (pagerCount < 5) {
		throw "pagerCount 参数最小值为5";
		// 小于5 分页无意义
	} else if (page <= pagerCount) {
		// 如果总页数小于了要显示的数字按钮个数 就直接遍历了 不需要显示省略按钮
		for (let i = 1; i <= page; i++) {
			lis += `<li class="page-number ${
				i == current ? "active" : ""
			}">${i}</li>`;
		}
	} else {
		// 定义两个参数
		// 用来保存当前选中分页前后的显示数字按钮(不包括省略前后的和选中的) 刚好是以下计算方法
		// 有问题 pagerCount 为偶数 显示小数点 将beforeNumber向下取整就可以了
		let beforeNumber = Math.floor(current - (pagerCount - 3) / 2),
			afterNumber = current + (pagerCount - 3) / 2;
		// 显示左省略按钮
		if (current >= pagerCount - 1) {
			lis += `<li class="page-number">1</li>
			<li class="material-icons page-dot page-dot-prev"></li>`;
		}
		// 提出问题: 选中页数为1 显示了0
		// 解决 当页数为1 将beforeNumber改为1 afterNumber为除去省略号后面的一个按钮
		// 同理解决current == page
		// 又有问题 点击前三个应该不分页 到 4(针对pagerCount参数来说) 了该分页 同理求得current == page
		if (current >= 1 && current < pagerCount - 1) {
			beforeNumber = 1;
			afterNumber = pagerCount - 1;
		} else if (current <= page && current > page - (pagerCount - 2)) {
			beforeNumber = page - (pagerCount - 2);
			afterNumber = page;
		}

		for (let i = beforeNumber; i <= afterNumber; i++) {
			lis += `<li class="page-number ${
				i == current ? "active" : ""
			}">${i}</li>`;
		}
	}
	// 显示右省略按钮
	if (current <= page - (pagerCount - 2)) {
		lis += `
		<li class="material-icons page-dot page-dot-next"></li>
		<li class="page-number">${page}</li>`;
	}

	// 最后拼接右按钮
	// 当前页数不是总页数就为可点击态
	lis += `
	<li class="material-icons page-btn page-btn-next ${
		current !== page ? "isClick" : ""
	}">
	  keyboard_arrow_right
  </li>`;
	_pagination.innerHTML = lis;

	// OK 分页已经没问题了 改变参数均没问题 随意修改

	// 点击数字按钮
	const _pageNumbers = document.querySelectorAll(".page-number");
	_pageNumbers.forEach((item) => {
		item.addEventListener("click", () => {
			// item.innerHTML为字符串 需要转为数字
			current = parseInt(item.innerHTML);
			createPagination();
		});
	});

	// 下一页
	const _pageBtnNext = document.querySelector(".page-btn-next");
	_pageBtnNext.addEventListener("click", () => {
		if (current !== page) {
			current++;
			createPagination();
		}
	});

	// 上一页
	const _pageBtnPrev = document.querySelector(".page-btn-prev");
	_pageBtnPrev.addEventListener("click", () => {
		if (current !== 1) {
			current--;
			createPagination();
		}
	});

	// 前进 pagerCount - 2 格
	const _pageDotNext = document.querySelector(".page-dot-next");
	// 因为省略按钮会时隐时现 直接绑定会报找不到元素错误
	// ?. 就可以了 只有元素存在再去绑定后面的事件
	_pageDotNext?.addEventListener("click", () => {
		current += pagerCount - 2;
		createPagination();
	});

	// 后退 pagerCount - 2 格
	const _pageDotPrev = document.querySelector(".page-dot-prev");
	_pageDotPrev?.addEventListener("click", () => {
		current -= pagerCount - 2;
		createPagination();
	});
};

        // 使用 fetch 发送 GET 请求
        async function fetchItems() {
            try {
                const response = await fetch('');
                if (!response.ok) {
                    throw new Error('网络响应不是预期的状态');
                }
                const data = await response.json();
                displayItems(data);
            } catch (error) {
                console.error('获取数据时出错:', error);
            }
        }

        // 显示数据
        function displayItems(items) {
            const itemList = document.getElementById('itemList');
            itemList.innerHTML = ''; // 清空现有内容
            items.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = `${item.name}: ${item.value}`;
                itemList.appendChild(listItem);
            });
        }

        // 页面加载完成后发送请求
        window.onload = fetchItems;



        function handleSelectChange() {
            const selectedValue = document.getElementById('options').value;
            const inputContainer = document.getElementById('inputContainer');
            inputContainer.innerHTML = ''; // Clear previous inputs

            if (selectedValue === '0') {
                inputContainer.innerHTML = `<label for="getin">入库数量:</label><br>
                                           <input type="number" id="numberInput" name="name">`;
            } else if (selectedValue === '1') {
                inputContainer.innerHTML = `<label for="getout">出库数量:</label><br>
                                           <input type="number" id="numberInput" name="name"><br>
                                           <label for="papermaker">甩纸:</label><br>
                                           <input type="number" id="npapermakerInput" name="papermaker"><br>
                                           <label for="customer">返库:</label><br>
                                           <input type="number" id="customer" name="customer">`;
            } else if (selectedValue === '2') {
                inputContainer.innerHTML = `<label for="newgetin">新入库数量:</label><br>
                                           <input type="number" id="numberInput" name="name"><br>
                                           <label for="papermaker">纸厂:</label><br>
                                           <input type="text" id="npapermakerInput" name="papermaker"><br>
                                           <label for="customer">客户:</label><br>
                                           <input type="text" id="customer" name="customer">`;
            }
        }
		document.getElementById('options').addEventListener('change', handleSelectChange);

        // Initial call to set up inputs based on the default selected value
        handleSelectChange();

        // Add event listener to the select element

        // Add event listener to the select element
        // Sample array with dynamic options
        const optionsArray = ['选项 1', '选项 2', '选项 3', '选项 4'];

        // Function to populate the select element based on the array
        function populateSelect(array) {
            const selectElement = document.getElementById('dynamicSelect');
            selectElement.innerHTML = ''; // Clear existing options

            array.forEach((item, index) => {
                const option = document.createElement('option');
                option.value = index; // You can set the value as needed
                option.textContent = item;
                selectElement.appendChild(option);
            });
        }

        // Initial population of the select element
        populateSelect(optionsArray);

        // Function to initialize date input with today's date
        function initializeDateInput() {
            const dateInput = document.getElementById('dateInput');
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            dateInput.value = formattedDate;
        }

        // Initialize date input with today's date
        initializeDateInput();

        // Example of updating the array and repopulating the select
        setTimeout(() => {
            const newOptionsArray = ['新选项 1', '新选项 2'];
            populateSelect(newOptionsArray);
        }, 5000); // Update after 5 seconds for demonstration purposes

createPagination();

// script.js
document.addEventListener('DOMContentLoaded', function() {
    // 示例结构体数组 - 产品数据
    const products = [
        // ...（保持之前的products数组不变）
    ];

    // 搜索历史 - 按字段存储
    let searchHistory = {
        name: ['产品1', '产品2', '产品3'],
        category: ['厂商1', '厂商2'],
        priceRange: ['consumer1', 'consumer2']
    };

    // 当前搜索结果
    let currentResults = [];

    // 跟踪当前活动的搜索框
    let activeSearchField = null;

    // 为每个搜索框添加事件监听
    document.querySelectorAll('.search-input').forEach(input => {
        const field = input.getAttribute('data-field');
        const dropdown = document.getElementById(`dropdown-${field}`);
        const historyItems = dropdown.querySelector('.history-items');
        const searchResults = dropdown.querySelector('.search-results');
        
        // 显示搜索历史
        function displayHistory() {
            historyItems.innerHTML = '';
            if (searchHistory[field] && searchHistory[field].length > 0) {
                searchHistory[field].forEach(item => {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    historyItem.textContent = item;
                    historyItem.addEventListener('click', function() {
                        input.value = item;
                        hideAllDropdowns();
                        performSearch(field, item);
                    });
                    historyItems.appendChild(historyItem);
                });
            } else {
                const noHistory = document.createElement('div');
                noHistory.className = 'history-item';
                noHistory.textContent = '暂无搜索记录';
                historyItems.appendChild(noHistory);
            }
        }
        
        // 显示搜索结果建议
        function displaySuggestions(keyword) {
            searchResults.innerHTML = '';
            if (!keyword) return;
            
            // 获取该字段的所有可能值
            const fieldValues = [...new Set(products.map(p => p[field]))];
            
            // 模糊匹配
            const suggestions = fieldValues.filter(value => 
                String(value).toLowerCase().includes(keyword.toLowerCase())
            );
            
            if (suggestions.length > 0) {
                suggestions.forEach(item => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'result-item';
                    resultItem.textContent = item;
                    resultItem.addEventListener('click', function() {
                        input.value = item;
                        hideAllDropdowns();
                        addToHistory(field, item);
                        performSearch(field, item);
                    });
                    searchResults.appendChild(resultItem);
                });
            } else {
                const noResults = document.createElement('div');
                noResults.className = 'result-item';
                noResults.textContent = '无匹配结果';
                searchResults.appendChild(noResults);
            }
        }
        
        // 添加到搜索历史
        function addToHistory(field, value) {
            if (!searchHistory[field]) {
                searchHistory[field] = [];
            }
            
            // 如果历史记录中已有该项，先移除
            searchHistory[field] = searchHistory[field].filter(
                historyItem => historyItem !== value
            );
            
            // 添加到历史记录开头
            searchHistory[field].unshift(value);
            
            // 限制历史记录数量
            if (searchHistory[field].length > 5) {
                searchHistory[field].pop();
            }
            
            displayHistory();
        }
        
        // 执行搜索
        function performSearch(field, value) {
            currentResults = products.filter(product => 
                String(product[field]).toLowerCase().includes(value.toLowerCase())
            );
            displaySearchResults();
        }
        
        // 点击输入框显示下拉框
        input.addEventListener('click', function(e) {
            e.stopPropagation();
            activeSearchField = field;
            displayHistory();
            hideAllDropdowns();
            dropdown.style.display = 'block';
            searchResults.innerHTML = '';
        });
        
        // 输入时进行模糊搜索建议
        input.addEventListener('input', function() {
            const keyword = input.value.trim();
            if (keyword) {
                displaySuggestions(keyword);
                dropdown.querySelector('.search-history').style.display = 'none';
            } else {
                dropdown.querySelector('.search-history').style.display = 'block';
                searchResults.innerHTML = '';
            }
        });
        
        // 回车键执行搜索
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const keyword = input.value.trim();
                if (keyword) {
                    hideAllDropdowns();
                    addToHistory(field, keyword);
                    performSearch(field, keyword);
                }
            }
        });
        
        // 鼠标进入搜索框或下拉框区域
        input.addEventListener('mouseenter', function() {
            activeSearchField = field;
        });
        
        dropdown.addEventListener('mouseenter', function() {
            activeSearchField = field;
        });
        
        // 鼠标离开搜索框或下拉框区域
        const searchContainer = input.closest('.search-container');
        searchContainer.addEventListener('mouseleave', function(e) {
            // 检查鼠标是否真的离开了整个搜索区域
            if (!searchContainer.contains(e.relatedTarget)) {
                // 延迟隐藏，给鼠标移动到下拉框的时间
                setTimeout(() => {
                    if (activeSearchField !== field) {
                        dropdown.style.display = 'none';
                    }
                }, 200);
            }
        });
        
        // 初始化显示历史记录
        displayHistory();
    });
    
    // 隐藏所有下拉框
    function hideAllDropdowns() {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
    
    // 显示搜索结果
    function displaySearchResults() {
        const container = document.getElementById('productList');
        container.innerHTML = '';
        
        if (currentResults.length === 0) {
            container.innerHTML = '<p>没有找到匹配的产品</p>';
            return;
        }
        
        currentResults.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <h3>${product.name}</h3>
                <p>类别: ${product.category}</p>
                <p>描述: ${product.description}</p>
                <p class="price">价格: ¥${product.price.toLocaleString()}</p>
                <p>价格区间: ${product.priceRange}</p>
            `;
            container.appendChild(card);
        });
    }
    
    // 点击页面其他区域隐藏所有下拉框
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideAllDropdowns();
            activeSearchField = null;
        }
    });
    
    // 鼠标移动时检查是否需要隐藏下拉框
    document.addEventListener('mousemove', function(e) {
        if (activeSearchField) {
            const searchContainer = document.querySelector(`input[data-field="${activeSearchField}"]`).closest('.search-container');
            const dropdown = document.getElementById(`dropdown-${activeSearchField}`);
            
            // 检查鼠标是否在搜索框或下拉框外
            if (!searchContainer.contains(e.target) && !dropdown.contains(e.target)) {
                hideAllDropdowns();
                activeSearchField = null;
            }
        }
    });
});
//材料排序与显示




//列表变换





// OK 没问题了 这样就做了一个灵活的分页函数了
// 拜拜 各位大佬 下期见
