document.addEventListener('DOMContentLoaded', function() {
    const itemsPerPage = 10; // 每页显示的项目数
    let currentPage = 1; // 当前页码
    const data = Array.from({length: 31}, (_, i) => ({
        name: Math.floor(Math.random() * 10000),
        price: Math.floor(Math.random() * 100),
        weight: Math.floor(Math.random() * 100),
        createTime: Math.floor(Math.random() * 100)
    })); // 示例数据
    const tableBody = document.querySelector('table tbody');
    const paginationNav = document.querySelector('.pagination nav');

    function renderTable(page) {
        tableBody.innerHTML = ''; // 清空表格
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = data.slice(start, end);

        pageItems.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${start + index + 1}日</td>
                <td>${item.price}</td>
                <td>${item.weight}</td>
                <td>${item.createTime}</td>
                <td>
                    <button class="edit">编辑</button>
                    <button class="delete">删除</button>
                </td>`;
            tableBody.appendChild(row);
        });
    }

    function renderPagination(totalPages) {
        paginationNav.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = i;
            if (i === currentPage) link.classList.add('active');
            else if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                link.addEventListener('click', () => {
                    currentPage = i;
                    renderTable(currentPage);
                    renderPagination(Math.ceil(data.length / itemsPerPage));
                });
            } else {
                link.textContent = '...';
                link.classList.add('disabled');
            }
            paginationNav.appendChild(link);
            if (i < totalPages) {
                paginationNav.appendChild(document.createTextNode(' ')); // 添加间距
            }
        }
    }

    function gotoPage() {
        const gotoPage = parseInt(document.querySelector('.pagination input[type="text"]').value);
        if (!isNaN(gotoPage) && gotoPage > 0 && gotoPage <= Math.ceil(data.length / itemsPerPage)) {
            currentPage = gotoPage;
            renderTable(currentPage);
            renderPagination(Math.ceil(data.length / itemsPerPage));
        }
    }

    // 初始化
    renderTable(currentPage);
    renderPagination(Math.ceil(data.length / itemsPerPage));

    // 监听分页选择变化
    document.querySelector('.pagination select').addEventListener('change', function(e) {
        itemsPerPage = parseInt(e.target.value);
        renderTable(currentPage = 1); // 更新每页条目数并重新渲染第一页
        renderPagination(Math.ceil(data.length / itemsPerPage));
    });

    // 监听前往页输入框
    document.querySelector('.pagination input[type="text"]').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            gotoPage();
        }
    });
});

document.getElementById('addProduct').addEventListener('click', function() {
    location.href = 'index.html';
});

document.getElementById('options').addEventListener('change', function() {
    const selectedValue = this.value;
    const inputContainer = document.getElementById('inputContainer');
    inputContainer.innerHTML = ''; // Clear previous inputs

    if (selectedValue === '0') {
        inputContainer.innerHTML = '<label for="nameInput">Enter your name:</label><br>' +
                                   '<input type="text" id="nameInput" name="name">';
    } else if (selectedValue === '1') {
        inputContainer.innerHTML = '<label for="ageInput">Enter your age:</label><br>' +
                                   '<input type="number" id="ageInput" name="age">';
    } else if (selectedValue === '2') {
        inputContainer.innerHTML = '<label for="emailInput">Enter your email:</label><br>' +
                                   '<input type="email" id="emailInput" name="email">';
    }
});

