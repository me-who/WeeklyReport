var mysql = require('mysql');
var $conf = require('../conf/db');
var $sql = require('./userSqlMapping');

var Excel = require('exceljs');

// 使用连接池，提升性能
var pool = mysql.createPool( $conf.mysql );

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
  if(typeof ret === 'undefined') {
    res.json({
      code:'1',
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};

module.exports = {
  add: function (req, res, next) {
    pool.getConnection(function(err, connection) {
      // 获取前台页面传过来的参数
      var param = req.query || req.params;
      // 建立连接，向表中插入值
      // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
      connection.query($sql.insert, [param.name, param.username, param.password, param.position, param.field, param.auth], function(err, result) {
        if(result) {
          result = {
            code: 200,
            msg:'增加成功'
          };
        }
        // 以json形式，把操作结果返回给前台页面
        jsonWrite(res, result);

        // 释放连接
        connection.release();
      });
    });
  },
  queryById: function (req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function(err, connection) {
      connection.query($sql.queryById, param.username, function(err, result) {
        jsonWrite(res, result);
        connection.release();

      });
    });
  },
  updatePass: function (req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function (err, connection) {
      connection.query($sql.updatePass, [param.new_password, param.username],function (err, result) {
        jsonWrite(res, result);
        connection.release();
      })
    });
  },
  deleteUser: function (req, res, next) {
    var param = req.query || req.params;
    param = param.data[0];
    pool.getConnection(function (err, connection) {
      connection.query($sql.deleteUser, param.username, function (err, result) {
        jsonWrite(res, result);
        connection.release();
      })
    });
  },
  queryAll: function (req, res, next) {
    pool.getConnection(function(err, connection) {
      connection.query($sql.queryAll, function(err, result) {
        jsonWrite(res, result);
        connection.release();
      });
    });
  },
  insertReport: function (req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function(err, connection) {
      connection.query($sql.insertReport, [param.tag, param.location, param.project, param.previous_plan, param.finished, param.working_hours_this, param.plan_for_next, param.working_hours_next, param.delivered], function(err, result) {
        jsonWrite(res, result);
        connection.release();
      });
    });
  },
  queryRepByName: function (req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function(err,connection) {
      connection.query($sql.queryRepByName, param.name, function (err, result) {
        jsonWrite(res, result);
        connection.release();
      })
    })
  },
  queryRepAll: function (req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function(err, connection) {
      connection.query($sql.queryRepAll, param.count, function(err, result) {
        jsonWrite(res, result);
        connection.release();
      });
    });
  },
  queryRangeRepAll: function (req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function(err, connection) {
      connection.query($sql.queryRangeRepAll, [param.range[0], param.range[1]], function(err, result) {
        jsonWrite(res, result);
        connection.release();
      });
    });
  },
  queryProAll: function (req, res, next) {
    pool.getConnection(function(err,connection) {
      connection.query($sql.queryProAll, function(err,result) {
        jsonWrite(res,result);
        connection.release();
      })
    })
  },
  queryRepByWeek: function (req, res, next) {
      var param = req.query || req.params;
      pool.getConnection(function(err,connection) {
        connection.query($sql.queryRepByWeek, [param.tag, param.count], function(err,result) {
          jsonWrite(res,result);
          connection.release();
        })
      })
  },
  queryRepByRange: function (req, res, next) {
    var param = req.query || req.params;
    console.log(param);
    pool.getConnection(function(err,connection) {
      connection.query($sql.queryRepByRange, [param.tag, param.range[0], param.range[1]], function(err,result) {
        jsonWrite(res,result);
        connection.release();
      })
    })
  },
  updateRep: function (req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function(err,connection) {
      connection.query($sql.updateRep, [param.previous_plan, param.finished, param.working_hours_this, param.plan_for_next, param.working_hours_next, param.delivered, param.tag, param.project], function(err,result) {
        jsonWrite(res,result);
        connection.release();
      })
    })
  },
  insertPro: function (req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function(err, connection) {
      connection.query($sql.insertPro, [param.pro_name, param.pro_des], function(err, result) {
        jsonWrite(res, result);
        connection.release();
      });
    });
  },
  deletePro: function (req, res, next) {
    var param = req.query || req.params;
    console.log(param);
    param = param.pro[0];
    pool.getConnection(function (err, connection) {
      connection.query($sql.deletePro, param.pro_name, function (err, result) {
        jsonWrite(res, result);
        connection.release();
      })
    });
  },
  exportRep: function (req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function(err,connection) {
      connection.query($sql.exportRep, param.count, function(err,result) {
        jsonWrite(res,result);
        connection.release();
      })
    })
  },
  queryWeekRep: function (req, res, next) {
    var param = req.query || req.params || req.form;
    pool.getConnection(function(err,connection) {
      connection.query($sql.queryWeekRep, param.count, function(err,result) {

        // console.log(result);

        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('Sheet');

        worksheet.columns = [
          { header: '领域', key: 'field', width: 10 },
          { header: '姓名', key: 'name', width: 10 },
          { header: '职位', key: 'position', width: 10 },
          { header: '地点', key: 'location' },
          { header: '项目名称', key: 'project', width: 10 },
          { header: '本周原计划交付成果', key: 'previous_plan', width: 30 },
          { header: '本周完成', key: 'finished', width: 30 },
          { header: '本周工时', key: 'working_hours_this' },
          { header: '下周计划', key: 'plan_for_next', width: 30 },
          { header: '下周工时', key: 'working_hours_next' },
          { header: '下周需交付成果', key: 'delivered', width: 30 }
        ];

        worksheet.getRow(1).fill = {
          type: 'gradient',
          gradient: 'path',
          center:{left:0.5,top:0.5},
          stops: [
            {position:0, color:{argb:'FF92D050'}},
            {position:1, color:{argb:'FF92D050'}}
          ]
        };

        var data = result;
        var length = data.length;
        for(let i in data) {
          worksheet.addRow(data[i]).commit();
        }
        for(let i = 2; i <= data.length + 1; i++) {
          worksheet.getRow(i).alignment = { vertical: 'middle', horizontal: 'justify' };
        }
        // workbook.commit();

        res.attachment("report.xlsx")
        workbook.xlsx.write(res)
          .then(function() {
            res.end()
          });

        connection.release();
      })
    })
  },
  queryRangeRep: function (req, res, next) {
    var param = req.query || req.params || req.form;
    console.log(param);
    pool.getConnection(function(err,connection) {
      connection.query($sql.queryRangeRep, [param.start, param.end], function(err,result) {

        var workbook = new Excel.Workbook();

        var worksheet = workbook.addWorksheet('Sheet');

        worksheet.columns = [
          { header: '领域', key: 'field', width: 10 },
          { header: '姓名', key: 'name', width: 10 },
          { header: '职位', key: 'position', width: 10 },
          { header: '地点', key: 'location' },
          { header: '项目名称', key: 'project', width: 10 },
          { header: '本周原计划交付成果', key: 'previous_plan', width: 30 },
          { header: '本周完成', key: 'finished', width: 30 },
          { header: '本周工时', key: 'working_hours_this' },
          { header: '下周计划', key: 'plan_for_next', width: 30 },
          { header: '下周工时', key: 'working_hours_next' },
          { header: '下周需交付成果', key: 'delivered', width: 30 },
          { header: '填写时间', key: 'datetime', width: 10 }
        ];

        worksheet.getRow(1).fill = {
          type: 'gradient',
          gradient: 'path',
          center:{left:0.5,top:0.5},
          stops: [
            {position:0, color:{argb:'FF92D050'}},
            {position:1, color:{argb:'FF92D050'}}
          ]
        };

        var data = result;
        var length = data.length;

        for(let i in data) {
          worksheet.addRow(data[i]).commit();
        }
        for(let i = 2; i <= data.length + 1; i++) {
          worksheet.getRow(i).alignment = { vertical: 'middle', horizontal: 'justify' };
        }
        // workbook.commit();

        res.attachment("report.xlsx")
        workbook.xlsx.write(res)
          .then(function() {
            res.end()
          });

        connection.release();
      })
    })
  },
  getPrevious: function (req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function(err, connection) {
      connection.query($sql.getPrevious, [param.key, param.project], function(err, result) {
        jsonWrite(res, result);
        connection.release();
      });
    });
  },
};
