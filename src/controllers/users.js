import buildFormObj from '../lib/formObjectBuilder';

export default (router, { User }) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();
      ctx.render('users', { users });
    })
    .get('newUser', '/users/new', async (ctx) => {
      const { email } = ctx.request.body.form;
      const user = await User.findOne({
        where: {
          email,
        },
      });
      ctx.render('users/new', { f: buildFormObj(user) });
    })
    .get('editUser', '/users/edit/:id', async (ctx) => {
      const user = await User.findById(this.params);
      ctx.render('users/edit', { f: buildFormObj(user) });
    })
    .delete('users', '/users', async (ctx) => {
      const user = await User.findById(this.params)
      await User.destroy({ where: {id: this.params}, force: true });
      ctx.redirect(router.url('users'));
    })
    .post('users', '/users', async (ctx) => {
      const form = ctx.request.body.form;
      const user = User.build(form);
      try {
        await user.save();
        ctx.flash.set('User has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('users/new', { f: buildFormObj(user, e) });
      }
    });
};
