export const getViewStates = () => [
  {
    order: 0,
    animations: [
      {
        definition: {
          height: 0,
          duration: 300
        },
        view: 'state1'
      },
      {
        definition: {
          height: 0,
          duration: 300
        },
        view: 'state2'
      },
      {
        definition: {
          opacity: 0,
          duration: 300
        },
        view: 'state3'
      },
      {
        definition: {
          height: 0,
          duration: 300
        },
        view: 'state4'
      }
    ]
  },
  {
    order: 1,
    animations: [
      {
        definition: {
          height: 64,
          duration: 200
        },
        view: 'state1'
      }
    ]
  },
  {
    order: 2,
    animations: [
      {
        definition: {
          height: 0,
          duration: 100
        },
        view: 'state1'
      },
      {
        definition: {
          height: 300,
          duration: 300,
          delay: 300
        },
        view: 'state2'
      }
    ]
  },
  {
    order: 3,
    animations: [
      {
        definition: {
          height: 0,
          duration: 300
        },
        view: 'state2'
      },
      {
        definition: {
          height: 0,
          duration: 300
        },
        view: 'state4'
      },
      {
        definition: {
          height: 0,
          duration: 300
        },
        view: 'state5'
      },
      {
        definition: {
          opacity: 1,
          duration: 300,
          delay: 300
        },
        view: 'state3'
      }
    ]
  },
  {
    order: 4,
    animations: [
      {
        definition: {
          opacity: 0,
          duration: 300
        },
        view: 'state3'
      },
      {
        definition: {
          height: 0,
          duration: 300
        },
        view: 'state5'
      },
      {
        definition: {
          height: 300,
          duration: 300,
          delay: 300
        },
        view: 'state4'
      }
    ]
  },
  {
    order: 5,
    animations: [
      {
        definition: {
          height: 0,
          duration: 300
        },
        view: 'state4'
      },
      {
        definition: {
          height: 200,
          duration: 300,
          delay: 300
        },
        view: 'state5'
      }
    ]
  }
];
