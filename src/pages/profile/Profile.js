import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

// Material UI
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import AppWrapper from '../../components/wrapper/AppWrapper';
import { TertiaryTextField as InputField } from '../../components/widgets/InputField';
import { PrimaryButton as Button } from '../../components/widgets/Button';
import AvtarInput from './components/AvtarInput';
import Avtar from '../../assets/img/avtar/avtar.png';

import { URL } from '../../config';
import { transform } from '../../utils/transform';
export class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      name: '',
      email: '',
      username: '',
      contact: '',
      picture: Avtar
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handelFileSelect = this.handelFileSelect.bind(this);
  }

  componentDidMount() {
    axios({
      method: 'get',
      url: `${URL}/users/${this.props.match.params.userId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.data)
      .then(val => {
        this.setState(transform(val));
        this.setState({ id: val.id });
      })
      .catch(err => console.log(err));
  }

  async handleChange(event) {
    event.preventDefault();
    await this.setState({
      [event.currentTarget.name]: event.currentTarget.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    axios({
      method: 'patch',
      url: `${URL}/users/${this.props.match.params.userId}`,
      data: transform(this.state),
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      config: { headers: { 'Content-Type': 'application/json' } }
    })
      .then(res => res.data)
      .then(val => {
        if (val) {
          this.setState({
            redirect: true,
            redirectRoute: `/dashboard/${this.props.match.params.userId}`
          });
        }
      })
      .catch(err => console.log(err));
  }

  handelFileSelect(files) {
    let data = new FormData();
    data.append(this.state.id, files[0]);
    axios({
      method: 'post',
      url: `${URL}/users/upload`,
      data: data,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.data)
      .then(val => {
        if (val) {
          this.setState({ picture: '' });
          this.setState({ picture: val.picture });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    if (!this.state.redirect) {
      return (
        <AppWrapper>
          <Paper
            className="col-11 col-lg-6 col-md-8 col-xl-4 mt-5 mx-auto text-center justify-content-center"
            id="create-card"
          >
            <Typography
              variant="h4"
              fontFamily="Roboto"
              className="py-3 app-heading"
            >
              Edit Profile
            </Typography>
            <form className="w-75 mx-auto" onSubmit={this.handleSubmit}>
              <AvtarInput
                picture={this.state.picture !== "" ? this.state.picture: Avtar}
                handelFileSelect={this.handelFileSelect}
              />
              <InputField
                name="name"
                label="Name"
                placeholder="Name"
                className="w-100 my-2"
                margin="normal"
                type="text"
                value={this.state.name}
                onChange={this.handleChange}
                autoComplete="on"
                required={true}
                autoFocus={true}
              />
              <InputField
                name="email"
                label="Email"
                placeholder="Email"
                className="w-100 my-2"
                margin="normal"
                type="email"
                value={this.state.email}
                onChange={this.handleChange}
                autoComplete="on"
                required={true}
              />
              <InputField
                name="contact"
                label="Contact No."
                placeholder="Contact No."
                className="w-100 my-2"
                margin="normal"
                type="tel"
                value={this.state.contact}
                onChange={this.handleChange}
                autoComplete="on"
              />
              <InputField
                name="username"
                label="Username"
                placeholder="Username"
                className="w-100 my-2"
                margin="normal"
                type="text"
                value={this.state.username}
                onChange={this.handleChange}
                autoComplete="on"
                required={true}
              />
              <Button className="my-4" type="submit">
                Save Profile
              </Button>
            </form>
          </Paper>
        </AppWrapper>
      );
    } else {
      return <Redirect push to={this.state.redirectRoute} />;
    }
  }
}
