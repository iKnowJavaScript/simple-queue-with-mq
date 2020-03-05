const amqp = require("amqplib/callback_api");
let queue = "sample_queue";

// Producer
amqp.connect("amqp://localhost", function(connectionError, connection) {
  if (connectionError) {
    throw connectionError;
  }

  connection.createChannel(function(channelError, channel) {
    if (channelError) {
      throw channelError;
    }

    let message = "Hello world";

    channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log("Sent '%s'", message);
  });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});

// Consumer
amqp.connect("amqp://localhost", function(connectionError, connection) {
  if (connectionError) {
    throw connectionError;
  }

  connection.createChannel(function(channelError, channel) {
    if (channelError) {
      throw channelError;
    }

    // its possible for consumer to start before producer
    channel.assertQueue(queue, { durable: true });

    channel.prefetch(1);

    console.log("Waiting for messages in %s", queue);
    channel.consume(queue, function(message) {
      console.log("Received '%s'", msg.content.toString());

      setTimeout(() => {
        channel.ack(message);
      }, 1000);
    });
  });
});
