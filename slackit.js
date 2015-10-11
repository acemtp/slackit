Infos = new Mongo.Collection('infos');
if (Meteor.isClient) {
  Template.registerHelper('info', () => Infos.findOne() );

  Template.setup.events({
    'submit form': function (e) {
      const info = Infos.findOne();
      Infos.upsert(info && info._id, { $set: { org: $('#org').val(), token: $('#token').val(), sentence: $('#sentence').val(), userCount: 'N/A', userOnlineCount: 'N/A' } });
      return false;
    },
  });

  Template.login.events({
    'submit form': function (e) {
      console.log('sub', $('#email').val());
      $('#button').prop('disabled', true).removeClass('error').text('PLEASE WAIT!');
      Meteor.call('j', $('#email').val(), err => {
        if(err) {
          console.log('err', err);
          $('#button').prop('disabled', false).addClass('error').text(err.error);
        } else {
          $('#button').addClass('success').text('WOOT. CHECK YOUR EMAIL!');
        }
      });
      return false;
    },
  });
}

if (Meteor.isServer) {

  Infos.allow({
    insert() { return Infos.find().count() === 0; }
  });

  Meteor.publish(null, () => {
    return Infos.find({}, { fields: { token: 0 } });
  });

  Meteor.methods({
    j(email) {
      const info = Infos.findOne();
      let res;
      try {
        res = HTTP.post(`https://${info.org}.slack.com/api/users.admin.invite`, {
          params: {
             email,
             token: info.token,
          }
        });
      } catch(e) {
        console.log('eee', e);
        throw new Meteor.Error('yolo2', 'boom2');
      }
      if(res && res.data && res.data.ok) {
        console.log('aa', res);
      } else {
        console.error('boom', res);
        throw new Meteor.Error(res.data.error);
      }
    },
  });

  const update = () => {
    const info = Infos.findOne();
    if(info) {
      try {
        const res = HTTP.post(`https://${info.org}.slack.com/api/users.list`, {
          params: {
             token: info.token,
             presence: 1,
          }
        });
        if(res && res.data && res.data.ok) {
          //console.log('aa', res);

          Infos.update(info._id, { $set: {
            userCount: res.data.members.length,
            userOnlineCount: _.where(res.data.members, { presence: 'active' }).length,
          } });

        } else {
          console.error('boom', res);
        }
      } catch(e) {
        console.log('eee', e);
      }
    }
    Meteor.setTimeout(update, 1000);
  };

  update();
}
