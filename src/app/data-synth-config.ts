

import { DataSynthUtil } from 'data-synthesizer';

/*
 Sample Data Synthesizer Configuration Object

 This config object defines everything about how your data set will be created.


 to create calculated fields: if you want to generate a field based on some function of a raw field, then
    supply a function name after the field name value in the 'name' field, separated by a colon.
   for example, if you want to create a field value that is a hash of another field, you might do:

   name: 'myField:myHashingFunction',

   where, myHashingFunction takes a single argument that each field value will be passed into. your function
   should return the final value you want to use for that field. e.g.,:

   function myHashingFunction(val) {

      return makeHash(val);
   }


   The function should be either part of or visible to the data generation class at runtime. (or make function  part of config object?)

*/

let DataSynthConfig = {

  recordsToGenerate: 500,
  seed: 38561,  // seed is only defined at root level


  // NOTE: currently, these functions are only visible at the hierarchy level that it is defined.
  // not visible from child/nested objects.
  valueFormattingFunctions: {

    uCase: (val) => {
      return val.toUpperCase();
    },

    formatColor: (name: string) =>  {

      return 'Favorite color is ' + name;
    },

    // values returned as doubles may not need to be displayed with all of the decimal places.
    formatWeight: (val: number) => {
       return Math.round(val) ;
    }


  },


  fields: [
    {
      name: 'id',
      type: DataSynthUtil.UNIQUE_ID_AUTOINCREMENT
    },
    {
      name: 'uuid',
      type: DataSynthUtil.UNIQUE_ID_UUID
   },


    {
      // this field value will be an object or array of child values.
      // the 'config' object specified here has the exact same structure as the main, root config object.
      // however you do not specify a seed with child configs.
      // the DataSynthUtil.OBJECT type allows for any number of nested levels in the generated data.
      //   you can nest OBJECT types within OBJECT types
      name: 'personPets',
      type: DataSynthUtil.OBJECT,
      config: { // config specifies how to generate the child object fields
        recordsToGenerate: 1,

        fields: [
          {
            name: 'hasCat',
            type: DataSynthUtil.RANDOM_LIST_UNIFORM,
            list: [true, false]
          },
          {
            name: 'hasDog',
            type: DataSynthUtil.RANDOM_LIST_UNIFORM,
            list: [true, false]
          },
          {
            name: 'hasFish',
            type: DataSynthUtil.RANDOM_LIST_UNIFORM,
            list: [true, false]
          }
        ]
      }
    },


    {

      // you can assign multiple field values simultaneously; really this would only be done when sourcing from lists.
      // doesn't make much sense with numeric based values.

      // if your list is an array of objects and you want to select multiple field values from a single randomly chosen object
      //  then use an array as the name value here.
      //  then, the listObjectFieldName should specify (in the same order) the randomly selected list object fields you want to assign to the field names in the name array
      // the name of another field in this array that you want to choose the same randomly chosen array element from.
      // assumes you are choosing from an object;
      //  for example if you have an array of objects of first and last names, you may want to randomly select an object
      //  and assign the first and last name fields of that object to two different fields here.
      name: ['personFirstName', 'personLastName:uCase'],
      list: DataSynthUtil.PersonNames,
      listObjectFieldName: ['firstName', 'lastName'],  // the name of the fields to use from the object in the array of objects defined in 'list'
      type: DataSynthUtil.RANDOM_LIST_UNIFORM

    },

    // calcuated fields are based solely off of values for other fields in the same record.
    {
      name: 'firstAndLastName',

      // a field type of CALCULATED tells the generator to delay assigning this until all other fields in the record are assigned.
      type: DataSynthUtil.CALCULATED,

      // this is sort of a nonsense example, that just combines the person first and last name into a string and
      //  uses that as the field value.

      // the calculation function.
      // the entire data record will be passed into this function, so you can calulate this
      // field's value based off any of the other variable values.
      // the record will be an object with the field names and assigned values.
      fn: (rec) => (rec.personFirstName + ' ' + rec.personLastName)
    },

    /*
    {
      name: 'weight_lbs:formatWeight',
      type: DataSynthUtil.RANDOM_NUMERIC_RANGE_NORMAL,
      mean: 190,
      stDev: 10
    },
    */
    { name: 'weight_lbs',
  type: DataSynthUtil.RANDOM_NUMERIC_RANGE_EXPONENTIAL,
  lamdba: 1.1
},
    {
      name: 'dateCreated',
      type: DataSynthUtil.DATE_IN_PAST_RANGE,
      minDaysAgo: 0,
      maxDaysAgo: 7
    },
    {
      name: 'favoriteColor:formatColor',
      type: DataSynthUtil.RANDOM_LIST_WEIGHTED,
      list: ['blue', 'green', 'yellow', 'red'],
      // these weights means 30% of the people (records) will have blue, 20% will have green, 20% yellow, and 30% red
      weights: [0.30, 0.20, 0.20, 0.30]
    },
    {
      name: 'bestFriendName',
      type: DataSynthUtil.RANDOM_LIST_UNIFORM,
      list: ['Juliet G. Brock', 'Bradley Z. Duran', 'Kelsie G. Deleon', 'Jack C. Rios', 'Candice I. Meyer', 'Ursa L. Trujillo']
    },
    {
      name: 'otherFriendsName',
      type: DataSynthUtil.ITEMS_FROM_SET,
      itemCount: 3,
      list: ['Juliet G. Brock', 'Bradley Z. Duran', 'Kelsie G. Deleon', 'Jack C. Rios', 'Candice I. Meyer', 'Ursa L. Trujillo']
    }

  ]


};

export default DataSynthConfig;
