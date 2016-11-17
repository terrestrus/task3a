import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
// const app = restify.createServer();

app.use(cors());

const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';

let pc = {};

app.get('/', (req, res) => {
  res.json({
    hello: 'Привет JS World',
  });
});

app.get('/task3a', (req, res) => {
  res.json(pc);
});

app.get('/task3a/volumes', (req, res) => {
  let hdd = {};
  for (let key of pc.hdd) {
    if (!hdd[key.volume]) {
      hdd[key.volume] = key.size;
    } else {
      hdd[key.volume] += key.size;
    }
  };
  for (let key in hdd) {
    hdd[key] = hdd[key] + 'B';
  };
  res.json(hdd);
});


app.get('/task3a/:name', (req, res) => {
  const result = pc[req.params.name];

  if (result === undefined) {
    res.status(404).send('Not Found');
  } else {
    res.json(result);
  }
});

app.get('/task3a/:name/:subname', (req, res) => {
  const result = valid(req.params.name, req.params.subname);

  if (result === undefined) {
    res.status(404).send('Not Found');
  } else {
    res.json(result);
  }
});

app.get('/task3a/:name/:subname/:vendor', (req, res) => {
  const result = valid(req.params.name, req.params.subname, req.params.vendor);

  if (result === undefined) {
    res.status(404).send('Not Found');
  } else {
    res.json(result);
  }
});


app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
  fetch(pcUrl)
    .then(async(res) => {
      pc = await res.json();
    })
    .catch((err) => {
      console.log('Чтото пошло не так:', err);
    });
});

function valid(name, subname, other) {
  let result;
  if (Array.isArray(pc[name])) {
    if (!isNaN(+subname)) {
      subname = +subname;
    }
  }
  if (name in pc) {
    result = pc[name];
    if (subname in result && subname !== 'length') {
      result = result[subname];
      if (other !== undefined) {
        if (other !== undefined && !(typeof result === 'string') && other in result) {
          result = result[other];
          console.log(result);
        } else {
          result = undefined;
        }
      }
    } else {
      result = undefined;
    }
  }
  return result;
}
