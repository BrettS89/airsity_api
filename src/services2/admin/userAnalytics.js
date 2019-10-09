const Listen = require('../../models/Listened');

exports.getGenreListensCount = async (id, genre) => {
  const res = await Listen.aggregate([
    {
      '$match': { 'user': { '$eq': id.toString() } }
    },
    {
      '$lookup': {
        'from': 'songs',
        'let': { 'id': "$song" },
        'pipeline': [
          { '$match':
             { '$expr':
                { '$and':
                   [
                     { '$eq': [ "$_id",  "$$id" ] },
                     { '$eq': [ "$genre", genre ] }
                   ]
                }
             }
          },
       ],
        'as': "songs",
      },
    },
    {
      '$match': { 'songs': { '$ne': [] } }
    },
    {
      $count: "songs"
    }
  ])
  return res[0] ? res[0].songs : 0;
};
