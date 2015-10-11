a='addClass';z=()=>y.findOne();y=new Mongo.Collection('i');if(Meteor.isClient){
Template.registerHelper('i',()=>{return z()});Template.s.events({'submit #f'(){
Meteor.call('s',{o:$('#o').val(),t:$('#t').val(),s:$('#s').val()});return false
}});Template.l.events({'submit #f'(){$('#b').prop('disabled',true).removeClass(
'erro').text('PLEASE WAIT');Meteor.call('j',$('#e').val(),e=>{if(e)$('#b').prop
('disabled',false)[a]('erro').text(e.error);else $('#b')[a]('succes').text(`CH\
ECK YOUR EMAIL`)});return false}})}if(Meteor.isServer){Meteor.publish(null,()=>
{return y.find({},{fields:{t:0}})});Meteor.methods({s($set){i=z();y.upsert(i&&i
._id,{$set})},j(email){let i=z(),r;try{r=HTTP.post(`https://${i.o}.slack.com/a\
pi/users.admin.invite`,{params:{email,token:i.t}})}catch(e){}if(!r||!r.data||!r
.data.ok)throw new Meteor.Error(r.data.error)}});let u=()=>{let i=z();if(i){try
{let r=HTTP.post(`https://${i.o}.slack.com/api/users.list`, {params:{token:i.t,
presence:1}});if(r.data.ok) {y.update(i._id,{$set:{u:r.data.members.length,v:_.
where(r.data.members,{presence:'active'}).length}})}}catch(e){}}Meteor[`setTim\
eout`](u, 1000)};u()}//goodlucktounderstandanddebugthatlittlehacker.gometeorgo.
