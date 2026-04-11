module.exports = async function (context, req) {
  context.res = {
    status: 200,
    body: { message: "hello from site planner api", time: new Date().toISOString() }
  };
};
