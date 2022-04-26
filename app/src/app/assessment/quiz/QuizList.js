import React, { Component } from 'react'
import { Form, DropdownButton, Dropdown } from 'react-bootstrap';
import CriteriaService from '../../apps/services/CriteriaService';
import cogoToast from 'cogo-toast';

export class QuizList extends Component {

    constructor(props){
        super(props)
        this.state = {
          modalShow: false,
          criteria: {},
          listCriteria: []
        }
    }
    
    componentDidMount(){
       this.load();
    }

    async load(){
        try {
          let ret = await CriteriaService.list();
          this.setState({listCriteria: ret.data, criteria: {}});
        } catch(error) {
          console.error(error);
          cogoToast.error("Could not list");
        }
    }

    render() {
        return (
        <div className="col-lg-12 grid-margin stretch-card">             
        <div className="card">       
            <div className="card-body">
            <div className="d-flex flex-row justify-content-between">
                        <div className="justify-content-between">
                            <h4 className="card-title">Quiz</h4>
                        </div>
                        <div className="justify-content-between">
                            <button type="button" className="btn btn-warning" >
                                Guide
                            </button>
                            <button type="button" className="btn btn-success">
                                <i className="mdi mdi-content-save"></i>
                                Save
                            </button>
                        </div>
                    </div>
            <div className="table-responsive">
                <table className="table table-hover table-sm">
                <thead>
                    <tr>
                    <th> Level </th>
                    <th> Sigla </th>
                    <th> Criteria </th>
                    <th> Option </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.listCriteria.map( criteria => (
                    <tr key={ "criteria-id-"+criteria.id } >
                        <td> { criteria.level } </td>
                        <td> { criteria.sigla } </td>
                        <td> { criteria.criteria } </td>
                        <td>
                        <Form>
                        <Form.Group>
                            <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="NA" id={"na-radio-"+criteria.id} />
                            <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="PA" id={"pa-radio-"+criteria.id} />
                            <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="LA" id={"la-radio-"+criteria.id} />
                            <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="FA" id={"fa-radio-"+criteria.id} />
                        </Form.Group>
                        </Form>
                        </td>
                    </tr>
                    ))}                      
                </tbody>
                </table>
            </div>
            </div>
        </div>
        </div>
        );
    }

}

export default QuizList;