import Clone from "../CloneTwo/Clone";

const stories = [
  { name: "Didact introduction", url: "http://bit.ly/2pX7HNn" },
  { name: "Rendering DOM elements ", url: "http://bit.ly/2qCOejH" },
  { name: "Element creation and JSX", url: "http://bit.ly/2qGbw8S" },
  { name: "Instances and reconciliation", url: "http://bit.ly/2q4A746" },
  { name: "Components and state", url: "http://bit.ly/2rE16nh" }
];

function App(props) {

  return (
    Clone.createElement(
      'div',
      {},
      Clone.createElement(
        'h1',
        {}
      ),
      Clone.createElement(
        'input',
        {
          type: "checkbox",
          checked: true,
        }
      ),
      Clone.createElement(
        'ul',
        {},
        props.stories.map(story => Story({story}))
      ))
  )
    ;
}

// class App {
//
//   constructor(props) {
//     this.props = props;
//   }
//
//   render() {
//
//     return (
//       Clone.createElement(
//         'div',
//         {},
//         Clone.createElement(
//           'h1',
//           {}
//         ),
//         Clone.createElement(
//           'ul',
//           {},
//           this.props.stories.map(story => Clone.createElement(
//             Story,
//             {
//               ...story
//             },
//           ))
//         ))
//     );
//   }
// }

function Story(props) {

  return Clone.createElement(
    'li',
    {},
    Clone.createElement(
      'button',
      {
        onClick: () => console.log(1),
      },
      "button"
    ),
  );
}

// class Story {
//
//
//   render() {
//     return Clone.createElement(
//       'li',
//       {},
//       Clone.createElement(
//         'button',
//         {
//           onClick: () => console.log(1),
//         },
//         "123"
//       ),
//     );
//   }
// }

Clone.render(
  App({stories}),
  document.getElementById("root")
);
