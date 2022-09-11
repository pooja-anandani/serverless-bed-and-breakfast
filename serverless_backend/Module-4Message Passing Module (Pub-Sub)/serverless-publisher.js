/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.publishOrderDetails = async (req, res) => {
  // let message = req.query.message || req.body.message || 'Hello World!';

  res.set('Access-Control-Allow-Origin', "*");
  res.set('Access-Control-Allow-Methods', '*');
  res.set('Access-Control-Allow-Headers', '*');
  res.set('Access-Control-Request-Headers', '*');
  res.set('Access-Control-Max-Age', '86400');

  if (req.method === "OPTIONS") {
    // stop preflight requests here
    res.status(204).send('');
    return;
  }

  console.log(req.body);

  const request = req.body;

  require('dotenv').config();
  const { PubSub } = require(`@google-cloud/pubsub`);
  const pubsub = new PubSub();

  const publishMessage = (topicName, data) => {
    return new Promise(resolve => {

      const dataBuffer = Buffer.from(data);
      pubsub.getTopics({}, function (err, topics, nextQuery, apiResponse) {

        if (err) {
          console.error(err);
          resolve();
        }

        let topic;
        for (let t in topics) {
          topic = topics[t];
          console.log(topic.name);
          var splitName = topic.name.split('/')
          const name = splitName[splitName.length - 1];
          if (topicName === name) {
            break;
          } else {
            topic = null;
          }
        }

        if (topic) {
          topic.publish(dataBuffer);
          console.log('Message published');
          resolve();
        } else {
          console.log('Topic not found');
          resolve();
        }
      });
    });
  }

  const data = {
    email: request.email,
    order_id: request.order_id
  }
  await publishMessage('kitchen-order', JSON.stringify(data));
  console.log('Returning response.')
  res.status(200).send(request);
};

