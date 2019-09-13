import Clone from "../CloneTwo/Clone";

const stories = [
  { name: "Didact introduction", url: "http://bit.ly/2pX7HNn" },
  { name: "Rendering DOM elements ", url: "http://bit.ly/2qCOejH" },
  { name: "Element creation and JSX", url: "http://bit.ly/2qGbw8S" },
  { name: "Instances and reconciliation", url: "http://bit.ly/2q4A746" },
  { name: "Components and state", url: "http://bit.ly/2rE16nh" }
];

class App extends Clone.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 5,
    }
  }

  sub() {
    this.setState({
      count: this.state.count - 1
    })
  }

  render() {
    return (
      Clone.createElement(
        'div',
        {},
        Clone.createElement(
          'h1',
          {},
          this.state.count
        ),
        Clone.createElement(
          'button',
          {
            onClick: () => this.sub(),
          }
        ),
        Clone.createElement(
          'ul',
          {},
          this.props.stories
          // .filter((story, index) => index < this.state.count)
            .map((story, index) => index < this.state.count
              ? Clone.createElement(
                Story,
                {
                  ...story
                },
              ) : null
            )
        ))
    );
  }
}

class Story extends Clone.Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: Math.ceil(Math.random() * 100),
    };
  }


  componentDidMount() {
    super.componentDidMount()
    // this.setState({
    //   likes: 123,
    // })
  }


  like() {
    this.setState({
      likes: this.state.likes + 1,
    });
  }

  render() {
    const { name, url } = this.props;
    const { likes } = this.state;
    return Clone.createElement(
      'li',
      {},
      Clone.createElement(
        'button',
        {
          onClick: () => {
            this.like();
          },
        },
        likes,
      ),
      Clone.createElement(
        'a',
        {
          href: url,
        },
        name,
      )
    );
  }
}


// function App(props) {
//   return (
//     Clone.createElement(
//       'div',
//       {},
//       Clone.createElement(
//         'h1',
//         {}
//       ),
//       Clone.createElement(
//         'ul',
//         {},
//         props.stories.map(story => Clone.createElement(
//           Story,
//           {
//             ...story
//           },
//         ))
//       ))
//   );
// }
//
// function Story(props) {
//
//   const { name, url } = props;
//   // const { likes } = this.state;
//   return Clone.createElement(
//     'li',
//     {},
//     Clone.createElement(
//       'button',
//       {
//         onClick: () => console.log(this),
//       },
//       "Button",
//     ),
//     Clone.createElement(
//       'a',
//       {
//         href: url,
//       },
//       new Date().getTime(),
//     )
//   );
// }

Clone.render(
  Clone.createElement(
    App,
    {
      stories
    },
  ),
  document.getElementById("root")
);

