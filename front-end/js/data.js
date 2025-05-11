const data0 = {
    id:  1,
    customer_name: "test",
    material_supplier: "123",
    material_name: "456",
    total_stocking_quantity: 6600 ,
    total_forSale_quantity: 2000,
    extra: "",
    createdAt: "2025-05-10",
    updatedAt: "2025-05-10 19:19:43"

};

function DATA_0(id, customer_name, material_supplier,material_name,total_stocking_quantity,total_forSale_quantity,extra,createdAt,updatedAt) {
    this.id = id;
    this.customer_name = customer_name;
    this.material_supplier = material_supplier;
    this.material_name = material_name;
    this.total_stocking_quantity = total_stocking_quantity;
    this.total_forSale_quantity = total_forSale_quantity;
    this.extra = extra;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  
  }
  
  // 初始化100个结构体
  const data = [];
  for(let j = 0;j<=6;j==){


    for (let i = 0; i < 100; i++) {
     data.push(new Icon(i + 1, `产品 ${i + 1}`,` ${i + 1} ${i + 2}`,`${i + 1} ${i + 2}`,`${i + 1} ${i + 3}"," ${i + 1} ${i + 1}"," ${i + 1} ${i + 1}"," ${i + 1} ${i + 1}"," ${i + 1} ${i + 1}") ));
    }
}




const _data0 =
    {
        "id": 1,
        "customer_name": "test",
        "material_supplier": "123",
        "material_name": "456",
        "inbound_stocking_quantity": 1800,
        "remain_stocking_quantity": 1400,
        "consume_quantity": 200,
        "forSale_quantity": 200,
        "batch_time": "2025-05-10",
        "extra": "",
        "createdAt": "2025-05-10",
        "updatedAt": "2025-05-10 19:19:43",
        "curQty": 6600,
        "totalQty": 6600
    }
