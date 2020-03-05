const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function(error, connection) {
  if (error) {
    throw error;
  }

  connection.createChannel(function(connectionError, channel) {
    if (connectionError) {
      throw connectionError;
    }

    let queue = "sample_queue";
    let message = "Hello world";

    channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log("Sent '%s'", message);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0);
  }, 500);
});
