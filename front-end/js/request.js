
let debounceTimer;

// 使用 fetch 发送 GET 请求
async function fetchItems(query) {
    try {
        const response = await fetch(`http://localhost:5000/api/items?query=${encodeURIComponent(query)}`);//地址需要修改
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

// 输入框事件监听器
document.getElementById('searchInput').addEventListener('input', (event) => {
    const query = event.target.value;

    // 清除之前的定时器
    clearTimeout(debounceTimer);

    // 设置新的定时器
    debounceTimer = setTimeout(() => {
        if (query.trim()) {
            fetchItems(query);
        } else {
            displayItems([]); // 如果输入为空，清空列表
        }
    }, 1000); // 1秒延迟
});

// 页面加载完成后发送初始请求
window.onload = () => {
    fetchItems('');
};



// API 路由
app.get('/api/items', async (req, res) => {
    try {
        const query = req.query.query || '';
        const regex = new RegExp(query, 'i'); // 忽略大小写
        const items = await Item.find({ name: regex });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


