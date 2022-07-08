import React, { Component } from 'react'
import { Form, Tabs, Tab } from 'react-bootstrap';
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

        let level1 = this.state.listCriteria.filter( function (c) {
            return c.level === 1;
        });

        let level2 = this.state.listCriteria.filter( function (c) {
            return c.level === 2;
        });

        let level3 = this.state.listCriteria.filter( function (c) {
            return c.level === 3;
        });

        let level4 = this.state.listCriteria.filter( function (c) {
            return c.level === 4;
        });

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
            <Form>
            <Tabs defaultActiveKey="Level1" id="uncontrolled-tab-example">
                <Tab eventKey="Level1" title="Level 1">
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
                        {level1.map( criteria => (
                        <tr key={ "criteria-id-"+criteria.id } >
                            <td> { criteria.level } </td>
                            <td> { criteria.sigla } </td>
                            <td> { criteria.criteria } </td>
                            <td>
                            
                            <Form.Group>
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="NA" id={"na-radio-"+criteria.id} />
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="PA" id={"pa-radio-"+criteria.id} />
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="LA" id={"la-radio-"+criteria.id} />
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="FA" id={"fa-radio-"+criteria.id} />
                            </Form.Group>
                            
                            </td>
                        </tr>
                        ))}                      
                    </tbody>
                    </table>
                </div>
                </Tab>
                <Tab eventKey="Level2" title="Level 2">
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
                        {level2.map( criteria => (
                        <tr key={ "criteria-id-"+criteria.id } >
                            <td> { criteria.level } </td>
                            <td> { criteria.sigla } </td>
                            <td> { criteria.criteria } </td>
                            <td>
                            
                            <Form.Group>
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="NA" id={"na-radio-"+criteria.id} />
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="PA" id={"pa-radio-"+criteria.id} />
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="LA" id={"la-radio-"+criteria.id} />
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="FA" id={"fa-radio-"+criteria.id} />
                            </Form.Group>
                            
                            </td>
                        </tr>
                        ))}                      
                    </tbody>
                    </table>
                </div>
                </Tab>
                <Tab eventKey="Level3" title="Level 3">
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
                        {level3.map( criteria => (
                        <tr key={ "criteria-id-"+criteria.id } >
                            <td> { criteria.level } </td>
                            <td> { criteria.sigla } </td>
                            <td> { criteria.criteria } </td>
                            <td>
                            
                            <Form.Group>
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="NA" id={"na-radio-"+criteria.id} />
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="PA" id={"pa-radio-"+criteria.id} />
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="LA" id={"la-radio-"+criteria.id} />
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="FA" id={"fa-radio-"+criteria.id} />
                            </Form.Group>
                            
                            </td>
                        </tr>
                        ))}                      
                    </tbody>
                    </table>
                </div>
                </Tab>
                <Tab eventKey="Level4" title="Level 4">
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
                        {level4.map( criteria => (
                        <tr key={ "criteria-id-"+criteria.id } >
                            <td> { criteria.level } </td>
                            <td> { criteria.sigla } </td>
                            <td> { criteria.criteria } </td>
                            <td>
                            
                            <Form.Group>
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="NA" id={"na-radio-"+criteria.id} />
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="PA" id={"pa-radio-"+criteria.id} />
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="LA" id={"la-radio-"+criteria.id} />
                                <Form.Check custom inline type="radio" name={"group-"+criteria.id} label="FA" id={"fa-radio-"+criteria.id} />
                            </Form.Group>
                            
                            </td>
                        </tr>
                        ))}                      
                    </tbody>
                    </table>
                </div>
                </Tab>
                </Tabs>
                </Form>
            </div>
        </div>
        </div>
        );
    }

}

export default QuizList;