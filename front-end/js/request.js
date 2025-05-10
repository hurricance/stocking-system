
document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止默认的表单提交行为

    const formData = new FormData(this);
    const data = {
        customer_name: formData.get('customer_name'),
        material_supplier: formData.get('material_supplier'),
        material_name: formData.get('material_name'),
        total_stocking_quantity: parseInt(formData.get('total_stocking_quantity'), 10),
        total_forSale_quantity: parseInt(formData.get('total_forSale_quantity'), 10)
    };

    fetch('https://jsonplaceholder.typicode.com/posts', { // 替换为你的服务器端点
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        document.getElementById('responseContainer').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('responseContainer').innerHTML = `<p>Error: ${error.message}</p>`;
    });
});

//发送数据并接收

document.getElementById('dataForm').addEventListener('submit', function(event) {//按钮id
    event.preventDefault(); // 阻止默认的表单提交行为

    const formData = new FormData(this);
    const data = {
        customer_name: formData.get('customer_name'),
        material_supplier: formData.get('material_supplier'),
        material_name: formData.get('material_name'),
        total_stocking_quantity: parseInt(formData.get('total_stocking_quantity'), 10),
        total_forSale_quantity: parseInt(formData.get('total_forSale_quantity'), 10)
    };

    fetch('http://localhost:3000/saveData', { // 替换为你的服务器端点
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        document.getElementById('responseContainer').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('responseContainer').innerHTML = `<p>Error: ${error.message}</p>`;
    });
});