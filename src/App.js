import React, { Component } from "react";
import "./App.css";

// class Components should extend React.Component so they have access to .setState, amongst other things
class App extends Component {
  // React class components can be given a state property (available on this.state). This should be used to hold any data needed by the application which can change over a user's session.
  state = {
    // state should be an object - it can have as many keys as you like.
    buckets: [
      "leaky bucket",
      "boneless bucket",
      "bucket and spade",
      "giant pot noodle"
    ]
    /*[
      { name: 'leaky bucket', acquired: false },
      { name: 'boneless bucket', acquired: false },
      { name: 'bucket and spade', acquired: false },
      { name: 'giant pot noodle', acquired: false },
    ],*/
  };

  // the render method is invoked when a class component is instantiated (i.e. with JSX angle brackets). It must return renderable data (almost always more JSX React elements).
  render() {
    const user = "Challen";
    return (
      // as we're returning multiple components, we will wrap them in a div (so we only return one thing)
      <div>
        {/* Components are invoked/instantiated with angle brackets in JSX. They must have capital letter names (so as not to be confused with html tags). They can pass props as key-value pairs as shown below. */}
        <Heading user={user} />
        {/* notice how methods are pulled from the class instance ('this') */}
        <BucketAdder addBucket={this.addBucket} />
        <BucketList
          buckets={this.state.buckets}
          removeBucket={this.removeBucket}
        />
      </div>
    );
  }

  // even though this method is not used here (it's used in BucketAdder) we have to define it in App because that's where the prevState is.
  addBucket = bucketToAdd => {
    // this version of setState takes a function that returns a new state object. We should use this model when the new state relies on the previous state
    this.setState(prevState => {
      return {
        // spreading into a new array is a good way to add things to an array without mutation, WHICH IS BAD
        buckets: [...prevState.buckets, bucketToAdd]
      };
    });
  };

  // note the 'arrow function' like syntax. This is to ensure that 'this' within the function is bound to the instance of the class (else it may be something unpredictable based on how it is invoked further down the line)
  removeBucket = bucketToRemove => {
    this.setState(prevState => {
      return {
        // filter returns a new array, so all good.
        buckets: prevState.buckets.filter(bucket => bucket !== bucketToRemove)
      };
    });
  };
}

// this component needs a local state, so we can 'control' it - we are taking away the input field's responsibility for holding the state, so we can affect it in other ways (like clearing the field on submit)
class BucketAdder extends Component {
  state = {
    newBucket: ""
  };

  render() {
    return (
      // use a form to get form behaviour (enter => submit)! Remember that event listeners MUST be passed a function reference (not a function invocation!)
      <form onSubmit={this.handleSubmit}>
        <input onChange={this.handleChange} value={this.state.newBucket} />
      </form>
    );
  }

  handleSubmit = event => {
    event.preventDefault();
    // class components are instantiated with their props available on 'this'.
    this.props.addBucket(this.state.newBucket);
    // this model of setState does NOT rely on the previous state, so we can just call it with a new state object.
    this.setState({
      newBucket: ""
    });
  };

  handleChange = event => {
    this.setState({
      newBucket: event.target.value
    });
  };
}

const BucketList = props => {
  return (
    <ul>
      {/* any javascript (including this comment!) will be evaluated if it is in curly brackets, and the evaluated value inserted into the constructed React tree. .map is a good way of creating React elements out of data, because it returns a new array of values that can be rendered */}
      {props.buckets.map(bucket => (
        // note the implicit return - the '()' brackets are being used the group the next few lines as one item.
        <BucketListItem
          key={bucket}
          bucket={bucket}
          removeBucket={props.removeBucket}
        />
      ))}
    </ul>
  );
};

const BucketListItem = props => {
  return (
    <li
      // we need to pass onClick a function here, but we can't pass removeBucket directly because then it would be called with an event. To have control over what it is called with, we can pass our own anonymous callback function, and when that is called by the event listener, it will call removeBucket for us.
      onClick={() => {
        props.removeBucket(props.bucket);
      }}
    >
      {/* you'll have to change this! */}
      {props.bucket}
    </li>
  );
};

const Heading = props => {
  return <h2 className="Heading">{props.user}'s Bucket List!</h2>;
};

export default App;
