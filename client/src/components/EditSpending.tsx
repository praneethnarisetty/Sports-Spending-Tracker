import * as React from 'react'
import {
  Form, Button, Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile, patchSpending } from '../api/spendings-api'
import { SpendingLog } from '../types/SpendingLog';
import dateFormat from 'dateformat'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditSpendingProps {
  match: {
    params: {
      spendingId: string
    }
  },
  location: {
    state: SpendingLog
  }

  auth: Auth
}

interface EditSpendingState {
  file: any
  uploadState: UploadState,
  name: string,
  category: string,
  amount: number,
  date: Date,
  isUpdating: boolean
}

export class EditSpending extends React.PureComponent<
  EditSpendingProps,
  EditSpendingState
  > {
  state: EditSpendingState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    name: this.props.location.state.name,
    category: this.props.location.state.category,
    amount: this.props.location.state.amount,
    date: new Date(this.props.location.state.date),
    isUpdating: false
  }

  componentDidMount() {
    console.log(this.props.location.state)
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {

      this.setState({
        isUpdating: true
      })
      await patchSpending(this.props.auth.getIdToken(), this.props.match.params.spendingId, {
        name: this.state.name,
        amount: this.state.amount,
        category: this.state.category,
        date: dateFormat(this.state.date, 'yyyy-mm-dd') as string
      })
      alert('Spending was updated!')

    } catch (e) {
      alert('Could not update a spending: ' + e.message)
    } finally {
      this.setState({ isUpdating: false })
    }
  }

  handleSubmitUpload = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.spendingId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }


  handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(event.target.value) as any
    if (amount !== isNaN) {
      this.setState({ amount })
    }

  }

  handleDateChange = (date: Date) => {
    console.log('date is here!', date);
    this.setState({
      date
    });
  }


  handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ category: event.target.value })
  }

  render() {
    return (
      <div>
        <h1>Edit Spending</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <Input
              type="text"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
            <label>
              Amount
              <input
                type="number"
                value={this.state.amount}
                onChange={this.handleAmountChange} />
            </label>

            <label>Date</label>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={this.state.date}
              onChange={this.handleDateChange}
            />
            <label>Category
              <select value={this.state.category} onChange={this.handleCategoryChange}>
                <option value="food">Food</option>
                <option value="entertainment">Entertainment</option>
                <option value="utilities">Utilities</option>
                <option value="transportation">Transportation</option>
              </select>
            </label>

          </Form.Field>

          {this.renderUpdateButton()}
        </Form>


        <h1>Upload new image</h1>

        <Form onSubmit={this.handleSubmitUpload}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderUploadButton()}
        </Form>
      </div>
    )
  }

  renderUpdateButton() {

    return (
      <div>
        {this.state.isUpdating && <p>Updating spending log...</p>}
        <Button
          loading={this.state.isUpdating}
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }

  renderUploadButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
