import { MongoClient } from "mongodb";

const options = {};

let client;
let clientPromise;
let cachedPromise;

function getClientPromise() {
  // Return cached promise if it exists
  if (cachedPromise) {
    return cachedPromise;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env");
  }

  const uri = process.env.MONGODB_URI;

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    cachedPromise = global._mongoClientPromise;
    return cachedPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    cachedPromise = clientPromise;
    return cachedPromise;
  }
}

// Create a thenable object that only initializes when awaited
// This prevents the connection from being established during build time
const lazyClientPromise = {
  then(onFulfilled, onRejected) {
    return getClientPromise().then(onFulfilled, onRejected);
  },
  catch(onRejected) {
    return getClientPromise().catch(onRejected);
  },
  finally(onFinally) {
    return getClientPromise().finally(onFinally);
  }
};

export default lazyClientPromise;

