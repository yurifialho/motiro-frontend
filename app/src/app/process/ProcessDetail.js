import React, { Component } from 'react'
import { Form, DropdownButton, Dropdown, InputGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProcessService from '../apps/services/ProcessService';
import ProcessGoalService from '../apps/services/ProcessGoalService';
import ActivityService from '../apps/services/ActivityService';
import ActivityGoalService from '../apps/services/ActivityGoalService';
import AgentService from '../apps/services/AgentService';
import cogoToast from 'cogo-toast';

export class ProcessDetail extends Component {
    
    constructor(props){
        super(props)
        this.state = {
          process: {
              goal: {}
          },
          listProcessGoals: [],
          activityName: "",
          activitySelected: {
              goal: {},
              agent: {},
          },
          listActivities: [],
          listActivityGoals:[],
          listAgents: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleProcessGoalSelect = this.handleProcessGoalSelect.bind(this);
        this.handleActivityGoalSelect = this.handleActivityGoalSelect.bind(this);
        this.handleActivityAgentSelect = this.handleActivityAgentSelect.bind(this);
        this.unlinkProcessGoal = this.unlinkProcessGoal.bind(this);
        this.unlinkActivityGoal = this.unlinkActivityGoal.bind(this);
        this.unlinkActivityAgent = this.unlinkActivityAgent.bind(this);
        this.editActivity = this.editActivity.bind(this);
        this.getAgentNameById = this.getAgentNameById.bind(this);
    }
    
    componentDidMount(){
        this.loadProcessGoals();
        this.loadActivityGoals();
        this.loadAgents();
        let id = (this.state.process.id || this.props.match.params.id )
        if (id) {
            this.loadProcess(id);
            this.loadActivities(id);
        }
    }

    async loadProcess(id){
        try {
            let ret = await ProcessService.getOne(id);
            if (ret.status === 200) {
                let process = ret.data;
                if (process.goal == null){
                    process.goal = {};
                } else {
                    let goalRet = await ProcessGoalService.getOne(process.goal);
                    if ( goalRet.status === 200 ){
                        process.goal = goalRet.data;
                    } else {
                        cogoToast.error("Could not to get Process Data.");
                    }
                }
                this.setState({process: process});
            } else {
                cogoToast.error("Could not to get Process Data.");
            }
        } catch(error) {
          console.error(error);
          cogoToast.error("Could not to get Process Data.");
        }
    }

    async loadProcessGoals(){
        try {
            let ret = await ProcessGoalService.list()
            if ( ret.status === 200 ) {
                let process = ret.data;
                this.setState({listProcessGoals: process})
            } else {
                cogoToast.error("Could not to get Process Goal List.");
            }
        } catch(error) {
          console.error(error)
          cogoToast.error("Could not to get Process Goal List.");
        }
    }

    async loadActivities(processid) {
        try {
            let ret = await ProcessService.getActivities(processid);
            if ( ret.status === 200 ) {
                let activity = {
                    goal: {},
                    agent: {},
                }
                this.setState({ listActivities: ret.data, 
                                activitySelected: activity, 
                                activityName: ""});
            } else {
                cogoToast.error("Could not to get Process Activities List.");    
            }
        } catch(error) {
            console.error(error)
            cogoToast.error("Could not to get Process Activities List.");
        }
        
    }

    async loadActivityGoals() {
        try {
            let ret = await ActivityGoalService.list();
            if ( ret.status === 200 ){
                this.setState({listActivityGoals: ret.data});
            } else {
                cogoToast.error("Could not to get Activities Goals List.");
            }
        } catch(error) {
            console.error(error)
            cogoToast.error("Could not to get Activities Goals List.");
        }
    }

    async loadAgents() {
        try {
            let ret = await AgentService.list();
            if ( ret.status === 200 ){
                this.setState({listAgents: ret.data});
            } else {
                cogoToast.error("Could not to get Agents List.");
            }
        } catch(error) {
            console.error(error)
            cogoToast.error("Could not to get Agents List.");
        }
    }

    async save() {
        try {
            let process = this.state.process;
            if ( process.goal != null && this.state.process.goal.id ) {
                process.goal = this.state.process.goal.id;
            } else {
                process.goal = null;
            }
            let ret = null;
            if (process.id) {
                ret = await ProcessService.edit(process);
            } else {
                ret = await ProcessService.create(process);
            }
            
            if (ret.status === 200 ||  ret.status === 201) {
                this.loadProcess(process.id);
                cogoToast.success("Process saved");
            }
         } catch(error) {
            console.error(error)
            cogoToast.error("Could not to save");
        }
    }

    async saveActivity() {
        try {
            let activity = this.state.activitySelected;
            if ( activity.goal != null && activity.goal.id ) {
                activity.goal = activity.goal.id;
            } else {
                activity.goal = null;
            }
            if ( activity.agent != null && activity.agent.id ) {
                activity.agent = activity.agent.id;
            } else {
                activity.agent = null;
            }

            let ret = null;
            if (activity.id) {
                ret = await ActivityService.edit(activity);
            } else {
                ret = await ActivityService.create(activity);
            }
            
            if (ret.status === 200 ||  ret.status === 201) {
                this.loadActivities(this.state.process.id);
                cogoToast.success("Process saved");
            }
        } catch(error) {
            console.error(error)
            cogoToast.error("Could not to save");
        }
    }

    handleChange(event) {
        const obj = event.target;
        switch (obj.id) {
            case 'processNameInput': {
                let process = this.state.process;
                process.name = obj.value;
                this.setState({process: process});
                break;
            }
            case 'processDescriptionInput': {
                let process = this.state.process;
                process.description = obj.value;
                this.setState({process: process});
                break;
            }
            case 'processGoalName': {
                let process = this.state.process;
                if ( obj.value === "" ){
                    process.goal = {}    
                } else {
                    process.goal = {
                        name: obj.value
                    }
                }
                this.setState({process: process});
                break;
            }
            case 'activityName': {
                this.setState({ activityName: obj.value });
                break;
            }
            case 'activityNameInput': {
                let activity = this.state.activitySelected;
                activity.name = obj.name;
                this.setState({ activitySelected: activity });
                break;
            }
            case 'activityDescriptionInput': {
                let activity = this.state.activitySelected;
                activity.description = obj.value;
                this.setState({ activitySelected: activity });
                break;
            }
            case 'activityGoalName': {
                let activity = this.state.activitySelected;
                activity.goal = {
                    name: obj.value
                } 
                this.setState({ activitySelected: activity });
                break;
            }
            case 'activityAgentName': {
                let activity = this.state.activitySelected;
                activity.agent = {
                    name: obj.value
                } 
                this.setState({ activitySelected: activity });
                break;
            }
        }
    }

    handleProcessGoalSelect(eventKey, event) {
        let process = this.state.process;
        process.goal = this.state.listProcessGoals[eventKey];
        this.setState({ process: process });
    }

    handleActivityGoalSelect(eventKey, event) {
        let activity = this.state.activitySelected;
        activity.goal = this.state.listActivityGoals[eventKey];
        this.setState({ activitySelected: activity })
    }

    handleActivityAgentSelect(eventKey, event) {
        let activity = this.state.activitySelected;
        activity.agent = this.state.listAgents[eventKey];
        this.setState({ activitySelected: activity })
    }

    async addProcessGoal() {
        let goal = this.state.process.goal;
        try {
            if (!goal.id) {
                let ret = await ProcessGoalService.create(goal);
                if (ret.status === 200 ||  ret.status === 201) {
                    cogoToast.success("Process Goal saved")
                    goal = ret.data;
                    this.loadProcessGoals();
                 } else {
                    cogoToast.error("Cannot create process goal");
                }   
            }

            let process = this.state.process;
            process.goal = goal;
            this.setState({process: process});            
            cogoToast.warn("Process Goal Linked, but you need save after to persist!");

         } catch(error) {
            console.error(error)
            cogoToast.error("Could not create Process Goal");
        }
    }

    async addActivityGoal() {
        let goal = this.state.activitySelected.goal;
        try {
            if (!goal.id) {
                let ret = await ActivityGoalService.create(goal);
                if (ret.status === 200 ||  ret.status === 201) {
                    cogoToast.success("Activity Goal saved")
                    goal = ret.data;
                    this.loadProcessGoals();
                 } else {
                    cogoToast.error("Could not create Activity Goal");
                }   
            }

            let activity = this.state.activitySelected;
            activity.goal = goal;
            this.setState({activitySelected: activity});            
            cogoToast.warn("Activity Goal Linked, but you need save after to persist!");
            this.loadActivityGoals();
         } catch(error) {
            console.error(error)
            cogoToast.error("Could not create Activity Goal");
        }
    }

    unlinkProcessGoal() {
        let process = this.state.process;
        process.goal = {};
        this.setState({ process: process});
        cogoToast.warn("Process Goal Unlinked, but you need save after to persist!");
        this.loadProcessGoals();
    }

    unlinkActivityGoal() {
        let activity = this.state.activitySelected;
        activity.goal = {}
        this.setState({ activitySelected: activity});
        cogoToast.warn("Activity Goal Unlinked, but you need save after to persist!");
        this.loadActivityGoals();
    }

    unlinkActivityAgent() {
        let activity = this.state.activitySelected;
        activity.agent = {}
        this.setState({ activitySelected: activity});
        cogoToast.warn("Activity Agent Unlinked, but you need save after to persist!");
        this.loadActivityGoals();
    }

    async removeProcessGoal() {
        if (window.confirm("Are you sure?")) {
            let process = this.state.process;
            try {
                let ret = await ProcessGoalService.delete(process.goal.id);
                if ( ret.status === 204 ){
                    cogoToast.success("Process Goal deleted.");
                    this.unlinkProcessGoal();
                } else {
                    cogoToast.error("Could not to delete process goal");
                }
            } catch(error) {
                console.error(error)
                cogoToast.error("Could not to delete process goal");
            }
        }
    }

    async removeActivityGoal() {
        if (window.confirm("Are you sure?")) {
            let activity = this.state.activitySelected;
            try {
                let ret = await ActivityGoalService.delete(activity.goal.id);
                if ( ret.status === 204 ){
                    cogoToast.success("Activity Goal deleted.");
                    this.unlinkActivityGoal();                    
                } else {
                    cogoToast.error("Could not to delete activity goal");
                }
            } catch(error) {
                console.error(error)
                cogoToast.error("Could not to delete activity goal");
            }
        }
    }

    async addActivity() {
        try {
            let activity = {
                container: this.state.process.id,
                name: this.state.activityName,
                goal: null
            }
            let ret = await ActivityService.create(activity);
            if (ret.status === 200 || ret.status === 201) {
                this.loadActivities(this.state.process.id);
                cogoToast.success("Activity saved");
            } else {
                cogoToast.error("Could not to save the activity");
            }
        } catch(error) {
            console.error(error)
            cogoToast.error("Could not to save");
        }
    }

    editActivity(activity) {
        if ( activity.goal == null ) {
            activity.goal = {};
        } else {
            for ( let i=0; i < this.state.listActivityGoals.length; i++) {
                let goal = this.state.listActivityGoals[i];
                if (goal.id === activity.goal) {
                    activity.goal = goal;
                    break;
                }
                
            }
        }
        if ( activity.agent == null ) {
            activity.agent = {};
        } else {
            for ( let i=0; i < this.state.listAgents.length; i++) {
                let agent = this.state.listAgents[i];
                if (agent.id === activity.agent) {
                    activity.agent = agent;
                    break;
                }
                
            }
        }
        this.setState({activitySelected: activity});
        cogoToast.success("Activity loaded.");
    }

    getAgentNameById(id) {
        for ( let i=0; i < this.state.listAgents.length; i++) {
            let agent = this.state.listAgents[i];
            if (agent.id === id) {
                return agent.name;
            }
        }
    }

    async deleteActivity(id){
        if (window.confirm("Are you sure?")) {
            try {
                let ret = await ActivityService.delete(id);
                if (ret.status === 204) {
                    this.loadActivities(this.state.process.id);
                    cogoToast.success("Activity deleted");
                } else {
                    cogoToast.error("Could not to delete the activity");
                }
            } catch(error) {
                console.error(error)
                cogoToast.error("Could not to delete the activity");
            }
        }
    }

    render() {
        return (
        <div>
        <div className="page-header">
            <h3 className="page-title">Process Detail</h3>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item" aria-current="page"><Link to="/process">Process</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Process Detail</li>
                </ol>
            </nav>
        </div>
        <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">             
            <div className="card">       
                <div className="card-body">
                    <div className="d-flex flex-row justify-content-between">
                        <div className="justify-content-between">
                            <h4 className="card-title">(#{ this.state.process.id }) { this.state.process.name }</h4>
                        </div>
                        <div className="justify-content-between">
                            <Link to='/process'>
                            <button type="button" className="btn btn-danger" >
                                <i className="mdi mdi-window-close"></i>
                                Cancel
                            </button>
                            </Link>
                            <button type="button" className="btn btn-success" onClick={ () => { this.save() }}>
                                <i className="mdi mdi-content-save"></i>
                                Save
                            </button>
                        </div>
                    </div>
                    
                    <Form onSubmit={ event => event.preventDefault() }>
                        <Form.Group>
                            <label htmlFor="processNameInput">Name</label>
                            <Form.Control type="text" id="processNameInput" placeholder="Process Name" value={this.state.process.name || ''} onChange={this.handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="processDescriptionInput">Description</label>
                            <Form.Control as="textarea" id="processDescriptionInput" row={4} value={this.state.process.description || ''} onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="processObjectiveInput">Objective</label>
                            <InputGroup>
                                <DropdownButton variant='success' title="Objetivies" as={InputGroup.Prepend}>
                                    { this.state.listProcessGoals.map( (goal, index) => (
                                        <Dropdown.Item 
                                            key={"dropitem-goals-key-id"+index}
                                            disabled={ this.state.process.goal.id === goal.id }
                                            eventKey={index}
                                            onSelect={ this.handleProcessGoalSelect }
                                            onSubmit={ event => event.preventDefault() }>
                                            <i className={ this.state.process.goal.id === goal.id  ? "mdi mdi-window-close" : "mdi mdi-check" }>
                                                {goal.name} 
                                            </i>
                                            
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                                <Form.Control  id='processGoalName' name='processGoalName' type="text" className="form-control" 
                                        placeholder="Process Objective Name" aria-label="Process Objective Name" 
                                        aria-describedby="basic-addon2" value={ this.state.process.goal.name || '' }
                                        onChange={ this.handleChange } />
                                <InputGroup.Append>
                                    { ( this.state.process.goal.id ) &&
                                        <>
                                        <button className="btn btn-sm btn-warning"  type="button" onClick={ () => this.unlinkProcessGoal() }>
                                            <i className="mdi mdi-link-off"></i>    
                                        </button>
                                        <button className="btn btn-sm btn-danger" type="button" onClick={ () => this.removeProcessGoal() }>x</button>
                                        </>
                                    }
                                    { ( !this.state.process.goal.id ) &&
                                        <button className="btn btn-sm btn-success" type="button" onClick={ () => this.addProcessGoal() }>+</button>
                                    }
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                    </Form> 
                </div>
            </div>
            </div>
        </div>

        <div className="row">
            <div className="col-lg-6 grid-margin stretch-card">
            <div className="card">
            <div className="card-body">
                <h4 className="card-title">Bag of Activities</h4>
                <Form onSubmit={ event => event.preventDefault() }>
                    <InputGroup>
                        <Form.Control  id='activityName' name='activityName' type="text" className="form-control" 
                                placeholder="Activity Name" aria-label="Activity Name" 
                                aria-describedby="basic-addon2" value={ this.state.activityName || '' }
                                onChange={ this.handleChange } />
                        <InputGroup.Append>
                            <button className="btn btn-sm btn-success" type="button" onClick={ () => this.addActivity() }>+</button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
                <div className="table-responsive">
                <table className="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Executor</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    { this.state.listActivities.map( (s, index) => (
                        <tr key={"spec-id-"+s.id}>
                            <td>{s.id}</td>
                            <td>{s.name}</td>
                            <td>{ s.agent != null && 
                                this.getAgentNameById(s.agent)
                            }
                            </td>
                            <td>
                                <div className="btn-group" role="group" aria-label="bt-group-activity">
                                    <button type="button" className="btn btn-warning btn-sm" onClick={ () => this.editActivity(s)}>
                                        <i className="mdi mdi-eye"></i>
                                    </button>
                                    <button type="button" className="btn btn-danger btn-sm" onClick={ () => this.deleteActivity(s.id)}>
                                        <i className="mdi mdi-delete-forever"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))}  
                    </tbody>
                </table>
                </div>
            </div>
            </div>
            </div>

            <div className="col-lg-6 grid-margin stretch-card">
            <div className="card">
            <div className="card-body">
                <div className="d-flex flex-row justify-content-between">
                    <div className="justify-content-between">
                    <h4 className="card-title">Activity Detail { this.state.activitySelected.id ? "(#"+this.state.activitySelected.id+")" : "" }</h4>
                    </div>
                    <div className="justify-content-between">
                        { ( this.state.activitySelected.id ) &&
                        <button type="button" className="btn btn-success" onClick={ () => { this.saveActivity() }}>
                            <i className="mdi mdi-content-save"></i>
                            Save
                        </button>
                        }
                    </div>
                </div>
                <Form onSubmit={ event => event.preventDefault() }>
                    <Form.Group>
                        <label htmlFor="activityNameInput">Name</label>
                        <Form.Control type="text" id="activityNameInput" placeholder="Activity Name" value={this.state.activitySelected.name || ''} onChange={this.handleChange} required />
                    </Form.Group>
                    <Form.Group>
                        <label htmlFor="activityDescriptionInput">Description</label>
                        <Form.Control as="textarea" id="activityDescriptionInput" row={4} value={this.state.activitySelected.description || ''} onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group>
                            <label htmlFor="processDescriptionInput">Objective</label>
                            <InputGroup>
                                <DropdownButton variant='success' title="Objetivies" as={InputGroup.Prepend}>
                                    { this.state.listActivityGoals.map( (goal, index) => (
                                        <Dropdown.Item 
                                            key={"dropitem-activitygoals-key-id"+index}
                                            disabled={ (this.state.activitySelected != {} && this.state.activitySelected.goal.id === goal.id) }
                                            eventKey={ index }
                                            onSelect={ this.handleActivityGoalSelect }
                                            onSubmit={ event => event.preventDefault() }>
                                            <i className={ (this.state.activitySelected != {} && this.state.activitySelected.goal.id === goal.id)  ? "mdi mdi-window-close" : "mdi mdi-check" }>
                                                {goal.name} 
                                            </i>
                                            
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                                <Form.Control  id='activityGoalName' name='activityGoalName' type="text" className="form-control" 
                                        placeholder="Activity Objective Name" aria-label="Activity Objective Name" 
                                        aria-describedby="basic-addon2" value={ this.state.activitySelected.goal.name || '' }
                                        onChange={ this.handleChange } />
                                <InputGroup.Append>
                                    { ( this.state.activitySelected.goal.id ) &&
                                        <>
                                        <button className="btn btn-sm btn-warning"  type="button" onClick={ () => this.unlinkActivityGoal() }>
                                            <i className="mdi mdi-link-off"></i>    
                                        </button>
                                        <button className="btn btn-sm btn-danger" type="button" onClick={ () => this.removeActivityGoal() }>x</button>
                                        </>
                                    }
                                    { ( !this.state.activitySelected.goal.id ) &&
                                        <button className="btn btn-sm btn-success" type="button" onClick={ () => this.addActivityGoal() }>+</button>
                                    }
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="processDescriptionInput">Executor</label>
                            <InputGroup>
                                <DropdownButton variant='success' title="Agents" as={InputGroup.Prepend}>
                                    { this.state.listAgents.map( (agent, index) => (
                                        <Dropdown.Item 
                                            key={"dropitem-activityagent-key-id"+index}
                                            disabled={ (this.state.activitySelected != {} && this.state.activitySelected.agent.id === agent.id) }
                                            eventKey={index}
                                            onSelect={ this.handleActivityAgentSelect }
                                            onSubmit={ event => event.preventDefault() }>
                                            <i className={ (this.state.activitySelected != {} && this.state.activitySelected.agent.id === agent.id)  ? "mdi mdi-window-close" : "mdi mdi-check" }>
                                            {agent.name} 
                                            </i>
                                            
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                                <Form.Control  id='activityAgentName' name='activityAgentName' type="text" className="form-control" 
                                        placeholder="Agent Name" aria-label="Agent Name" 
                                        aria-describedby="basic-addon2" value={ this.state.activitySelected.agent.name || '' }
                                        onChange={ this.handleChange } disabled />
                                <InputGroup.Append>
                                    { ( this.state.activitySelected.agent.id ) &&
                                        <button className="btn btn-sm btn-warning"  type="button" onClick={ () => this.unlinkActivityAgent() }>
                                            <i className="mdi mdi-link-off"></i>    
                                        </button>
                                    }
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                </Form>
            </div>
            </div>
            </div>
        </div>
        </div>
        );
    }

}

export default ProcessDetail;