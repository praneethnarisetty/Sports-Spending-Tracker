import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createSpending, deleteSpending, getSpendings, patchSpending } from '../api/spendings-api'
import Auth from '../auth/Auth'
import { SpendingLog } from '../types/SpendingLog'

interface SpendingsProps {
  auth: Auth
  history: History
}

interface SpendingsState {
  spendings: SpendingLog[]
  newSpendingName: string,
  newSpendingAmount: any,
  newSpendingCategory: string,
  loadingSpendings: boolean
}

export class Spendings extends React.PureComponent<SpendingsProps, SpendingsState> {
  state: SpendingsState = {
    spendings: [],
    newSpendingName: '',
    newSpendingAmount: null,
    newSpendingCategory: 'food',
    loadingSpendings: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newSpendingName: event.target.value })
  }

  handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(event.target.value) as any
    if (amount !== isNaN) {
      this.setState({ newSpendingAmount: amount })
    }

  }


  handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ newSpendingCategory: event.target.value })
  }

  onEditButtonClick = (spending: SpendingLog) => {
    this.props.history.push(`/spendings/${spending.spendingId}/edit`, spending)
  }

  onSpendingCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const date = this.calculateDate()
      const newSpending = await createSpending(this.props.auth.getIdToken(), {
        name: this.state.newSpendingName,
        date,
        amount: this.state.newSpendingAmount,
        category: this.state.newSpendingCategory
      })
      this.setState({
        spendings: [...this.state.spendings, newSpending],
        newSpendingName: '',
        newSpendingAmount: null,
        newSpendingCategory: 'food'
      })
    } catch {
      alert('Spending creation failed')
    }
  }

  onSpendingDelete = async (spendingId: string) => {
    try {
      await deleteSpending(this.props.auth.getIdToken(), spendingId)
      this.setState({
        spendings: this.state.spendings.filter(spending => spending.spendingId != spendingId)
      })
    } catch {
      alert('Spending deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const spendings = await getSpendings(this.props.auth.getIdToken())
      this.setState({
        spendings,
        loadingSpendings: false
      })
    } catch (e) {
      alert(`Failed to fetch spendings: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Spending Tracker</Header>

        {this.renderCreateSpendingInput()}

        {this.renderSpendings()}
      </div>
    )
  }

  renderCreateSpendingInput() {
    return (
      <Grid.Row>
        <Grid.Column width={8}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New spending log',
              onClick: this.onSpendingCreate
            }}
            // fluid
            actionPosition="left"
            value={this.state.newSpendingName}
            placeholder="Buy snacks, drinks, video games"
            onChange={this.handleNameChange}
          />
          <input
            type="number"
            placeholder="enter amount"
            value={this.state.newSpendingAmount}
            onChange={this.handleAmountChange}
            style={{

              'height': '40px',
              marginLeft: "8px"
            }}
          />
          <select value={this.state.newSpendingCategory} onChange={this.handleCategoryChange} style={{
            'height': '38px',
            marginLeft: "8px"
          }}>
            <option value="food">Food</option>
            <option value="entertainment">Entertainment</option>
            <option value="utilities">Utilities</option>
            <option value="transportation">Transportation</option>
          </select>


        </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderSpendings() {
    if (this.state.loadingSpendings) {
      return this.renderLoading()
    }

    return this.renderSpendingsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading getSpendings
        </Loader>
      </Grid.Row>
    )
  }

  renderSpendingsList() {
    return (
      <Grid padded>
        {this.state.spendings.map((spending, pos) => {
          return (
            <Grid.Row key={spending.spendingId}>
              <Grid.Column width={6} verticalAlign="middle">
                {spending.name}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {spending.category}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {spending.amount}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {spending.date}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(spending)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onSpendingDelete(spending.spendingId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {spending.attachmentUrl && (
                <Image src={spending.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDate(): string {
    const date = new Date()
    date.setDate(date.getDate())
    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
