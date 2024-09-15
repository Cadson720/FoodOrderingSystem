const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// 创建MySQL连接
const db = mysql.createConnection({
    host: 'localhost', // 数据库主机
    user: 'root', // 数据库用户名
    password: 'crh030417', // 数据库密码
    database: 'restaurant' // 数据库名称
});

// 连接到MySQL数据库
db.connect(err => {
    if (err) {
        console.error('数据库连接失败: ' + err.stack);
        return;
    }
    console.log('成功连接到数据库');
});

// API端点：获取菜单项
app.get('/api/menu', (req, res) => {
    const query = 'SELECT * FROM menu';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`服务器正在运行在端口 ${port}`);
});
