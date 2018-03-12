var user = {
  insert:'insert into userinfo(name, username, password, position, field, auth) values (?,?,?,?,?,?)',
  updatePass:'update userinfo set password=? where username=?',
  deleteUser: 'delete from userinfo where username=?',
  queryById: 'select * from userinfo where username=?',
  queryAll: 'select * from userinfo',
  insertReport: 'insert into report(tag, location, project, previous_plan, finished, working_hours_this, plan_for_next, working_hours_next, delivered) values(?,?,?,?,?,?,?,?,?)',
  queryRepByName: 'select * from report where name=?',
  queryRepAll: 'select report.*, userinfo.name, userinfo.field, userinfo.position from report left join userinfo on report.tag = userinfo.key where yearweek(date_format(datetime, "%Y-%m-%d"))=yearweek(now())-?',
  updateRep: 'update report set previous_plan=?, finished=?, working_hours_this=?, plan_for_next=?, working_hours_next=?, delivered=? where tag=? and project=? and yearweek(date_format(datetime, "%Y-%m-%d"))=yearweek(now())',
  queryProAll: 'select * from project',
  insertPro: 'insert into project(pro_name, pro_des) values (?, ?)',
  deletePro: 'delete from project where pro_name=?',
  queryRepByWeek: 'select * from report where tag=? and yearweek(date_format(datetime, "%Y-%m-%d"))=yearweek(now())-?',
  queryRepByRange: 'select * from report where tag=? and datetime between ? and ?',
  queryWeekRep: 'select report.*, userinfo.name, userinfo.field, userinfo.position from report left join userinfo on report.tag = userinfo.key where yearweek(date_format(datetime, "%Y-%m-%d"))=yearweek(now())-?',
  queryRangeRep: 'select report.*, userinfo.name, userinfo.field, userinfo.position from report left join userinfo on report.tag = userinfo.key where datetime between ? and ?',
  queryRangeRepAll: 'select report.*, userinfo.name, userinfo.field, userinfo.position from report left join userinfo on report.tag = userinfo.key where datetime between ? and ?',
  getPrevious: 'select delivered from report where tag=? and project=? and yearweek(date_format(datetime, "%Y-%m-%d"))=yearweek(now())-1;'
  };

module.exports = user;