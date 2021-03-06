import React, { Component } from 'react';
import moment from 'moment';
import api from '../../services/api';
import Logo from '../../assets/logo.png';
import { Container, Form } from './styles';
import CompareList from '../../components/CompareList';

export default class Main extends Component {
  state = {
    loading: false,
    repositoryInput: '',
    repositories: [],
    repositoryError: false,
  };

  handleAddRepository = async (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    try {
      const { data: repository } = await api.get(`/repos/${this.state.repositoryInput}`);

      // Check if Repository already exists, don't add again.
      const alreadyExists = this.state.repositories.some(repo => repo.id === repository.id);

      if (alreadyExists) {
        this.setState(state => ({
          repositoryError: false,
          repositoryInput: '',
        }));
      } else {
        repository.lastCommit = moment(repository.pushed_at).fromNow();

        this.setState(state => ({
          repositoryError: false,
          repositoryInput: '',
          repositories: [...state.repositories, repository],
        }));
      }
    } catch (error) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Container>
        <img src={Logo} alt="Github Compare" />

        <Form withError={this.state.repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="usuário/repositório"
            value={this.state.repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">
            {this.state.loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}
          </button>
        </Form>

        <CompareList repositories={this.state.repositories} />
      </Container>
    );
  }
}
