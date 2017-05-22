import buildFormObj from '../lib/formObjectBuilder';

export default (router, { User }) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();
      ctx.render('users', { users });
    })
    .get('newUser', '/users/new', async (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
    })
    .get('editUser', '/users/edit/:id', async (ctx) => {
      const user = await User.findById(ctx.params.id);
      ctx.render('users/edit', { user, f: buildFormObj(user) });
    })
    .put('users', '/users', async (ctx) => {
      const { email, firstName, lastName } = ctx.request.body.form;
      const { id } = ctx.request.body;
      const user = await User.findById(id);
      try {
        await user.update({ email, firstName, lastName });
        ctx.flash.set('User has been update');
        ctx.redirect(router.url('users'));
      } catch (e) {
        ctx.render('users/edit', { user, f: buildFormObj(user, e) });
      }
    })
    .delete('users', '/users', async (ctx) => {
      const { id } = ctx.request.body;
      try {
        await User.destroy({ where: { id }, force: true });
        ctx.flash.set('User has been delete');
      } catch (e) {
        ctx.flash.set('Error');
      }
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
