import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';


import axios from 'axios';

const articleStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: '1em',
    // border: 'solid red 2px',
    width: '90%',
    // maxWidth: '1440px', //Laptop
    // minWidth: '1200px',
    margin: '20px auto',
    height: 'auto'
  }
  
  const sectionStyle = {
    width: '90%',
    alignSelf: 'start',
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    // boxShadow: '5px 5px 5px #e0e0e0',
    display: 'grid',
    // gridTemplateRows: 'auto',
    gridTemplateColumns: '1fr',
    gridGap: '1em',
    padding: '1em',
    margin: '0 auto'
  }


const styles = ((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    }, 
    //inside create to do
    // toolbar: theme.mixins.toolbar,
    title: {
		margin: theme.spacing(2),
		flex: 1
	},
	submitButton: {
		display: 'block',
		color: 'primary',
		textAlign: 'center',
		position: 'absolute',
		top: 8,
		right: 90
	},
    closeButton: {
		display: 'block',
		color: 'primary',
		textAlign: 'center',
		position: 'absolute',
		top: theme.spacing(1),
		right: theme.spacing(1)
	},
    // closeButton: {
        // 	position: 'absolute',
        // 	right: theme.spacing(1),
        // 	top: theme.spacing(1),
        // 	color: theme.palette.grey[500]
        // }

    //Position create task button
	floatingButton: {
		position: 'fixed',
		bottom: 20,
		right: 100
	},
	form: {
        padding: '0 20px 10px 5px'
		// width: 600,
        // margin: 10,
        // padding: 10
        // margin: theme.spacing(3)
		// marginLeft: 13,
		// marginTop: theme.spacing(3)
	},
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
      },
    formItems: {
		// width: 600,
        // padding: 10,
        margin: theme.spacing(1)
        // margin: theme.spacing(3)
		// marginLeft: 13,
		// marginTop: theme.spacing(3)
	},
	toolbar: theme.mixins.toolbar,
	root: {
        //cards styling
		minWidth: 300
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	pos: {
		marginBottom: 12
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2)
	},
	// closeButton: {
	// 	position: 'absolute',
	// 	right: theme.spacing(1),
	// 	top: theme.spacing(1),
	// 	color: theme.palette.grey[500]
	// }
    }));

    const Transition  = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="down" ref={ref} {...props} />;
    });


    class todo extends Component {
        constructor(props) {
            super(props);
            this.state = {
                todos: '',
                backLog: [],
                inProgress: [],
                complete: [],
                title: '',
                body: '',
                status: '',
                todoId: '',
                errors: [],
                open: false,
                uiLoading: true,
                buttonType: '',
                viewOpen: false
            };
    
            this.deleteTodoHandler = this.deleteTodoHandler.bind(this);
            this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
            this.handleViewOpen = this.handleViewOpen.bind(this);
        }
    
        handleChange = (event) => {
            this.setState({
                [event.target.name]: event.target.value
            });
        };

        handleSelect = (event) => {
            this.setState({
                status: event.target.value
            });
        };
    
        componentWillMount = () => {
            axios
                .get('https://us-central1-projecttracker-c0c00.cloudfunctions.net/api/todos')
                .then((response) => {

                    this.setState({
                        backLog: response.data.filter((todo) => 
                        todo.status === "backLog"),
                        inProgress: response.data.filter((todo) => 
                        todo.status === "inProgress"),
                        complete: response.data.filter((todo) => 
                        todo.status === "complete"),
                        uiLoading: false
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        };
    
        deleteTodoHandler(data) {
            let todoId = data.todo.todoId;
            axios
                .delete(`https://us-central1-projecttracker-c0c00.cloudfunctions.net/api/todo/${todoId}`)
                .then(() => {
                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    
        handleEditClickOpen(data) {
            this.setState({
                title: data.todo.title,
                body: data.todo.body,
                status: data.todo.status,
                todoId: data.todo.todoId,
                buttonType: 'Edit',
                open: true
            });
        }
    
        handleViewOpen(data) {
            this.setState({
                title: data.todo.title,
                body: data.todo.body,
                viewOpen: true
            });
        }

       
    
        render() {
            const DialogTitle = withStyles(styles)((props) => {
                const { children, classes, onClose, ...other } = props;
                return (
                    <MuiDialogTitle disableTypography className={classes.root} {...other}>
                        <Typography variant="h6">{children}</Typography>
                        {onClose ? (
                            <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        ) : null}
                    </MuiDialogTitle>
                );
            });
    
            const DialogContent = withStyles((theme) => ({
                viewRoot: {
                    padding: theme.spacing(2)
                }
            }))(MuiDialogContent);
    

            const { classes } = this.props;
            const { open, errors, viewOpen } = this.state;
    
            //this sets state to open and buttonType flag to add:
            const handleClickOpen = () => {
                this.setState({
                    todoId: '',
                    title: '',
                    body: '',
                    buttonType: '',
                    open: true
                });
            };
    
            const handleSubmit = (event) => {
                event.preventDefault();
                const userTodo = {
                    title: this.state.title,
                    body: this.state.body,
                    status: this.state.status
                };
                let options = {};
                if (this.state.buttonType === 'Edit') {
                    options = {
                        url: `https://us-central1-projecttracker-c0c00.cloudfunctions.net/api/todo/${this.state.todoId}`,
                        method: 'put',
                        data: userTodo
                    };
                } else {
                    options = {
                        url: 'https://us-central1-projecttracker-c0c00.cloudfunctions.net/api/todo',
                        method: 'post',
                        data: userTodo
                    };
                }
               
                axios(options)
                    .then(() => {
                        this.setState({ open: false });
                        window.location.reload();
                    })
                    .catch((error) => {
                        this.setState({ open: true, errors: error.response.data });
                        console.log(error);
                    });
            };
    
            const handleViewClose = () => {
                this.setState({ viewOpen: false });
            };
    
            //this sets the state to close
            const handleClose = (event) => {
                this.setState({ open: false });
            };

            
            
            //ui loading screen
            if (this.state.uiLoading === true) {
                return (
                    <main className={classes.content}>
                        {/* <div className={classes.toolbar} /> */}
                        {this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
                    </main>
                );
            } else {
                //project tracker dashboard
                return (
                    <main className={classes.content}>
                        {/* <div className={classes.toolbar} /> */}


                        <Typography variant="h1" color="primary" align="center">Project Tracker</Typography>
                        <Typography variant="h4" color="secondary" align="center">Built with ReactJS</Typography>    
    
                        <IconButton
                            className={classes.floatingButton}
                            color="primary"
                            aria-label="Add Todo"
                            onClick={handleClickOpen}
                        >
                        <AddCircleIcon style={{ fontSize: 80 }} />
                        New task
                        </IconButton>

                        {/*Dialog is Material UI Modal */}
                        <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
                            
                            {/* This is the title of modal box */}
                            <Typography variant="h6" className={classes.title}>
                                    {this.state.buttonType === 'Edit' ? 'Edit Todo' : 'Create a new Todo'}
                            </Typography>
                           
                           {/* Button inside of modal checks state if edit then save else submit new */}
                            <Button
                                autoFocus
                                color="primary"
                                onClick={handleSubmit}
                                className={classes.submitButton}
                            >
                                {this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
                            </Button>
                            {/* This is the close Button*/}
                            <Button 
                                edge="end" 
                                color="primary" 
                                onClick={handleClose}
                                className={classes.closeButton} 
                            >
                                Cancel
                            </Button>
                            {/* </Toolbar> */}

                            <form className={classes.form} noValidate>
                            {/* Change status of todo */}
                            <FormControl className={classes.formControl}>
                                    <InputLabel id="statusLabel">Status</InputLabel>
                                    <Select 
                                    labelId="statusLabel" 
                                    id="select" 
                                    size='medium'
                                    value={this.state.status}
                                    onChange={this.handleSelect}>
                                        <MenuItem value={'backLog'}>BackLog</MenuItem>
                                        <MenuItem value={'inProgress'}>In Progress</MenuItem>
                                        <MenuItem value={'complete'}>Complete</MenuItem>
                                    </Select>
                            </FormControl>

                                
                            
                                {/* This is the name of todo */}
                                <TextField className={classes.formItems}
                                variant="outlined"
                                required
                                fullWidth
                                id="todoTitle"
                                label="Todo Title"
                                name="title"
                                autoComplete="todoTitle"
                                helperText={errors.title}
                                value={this.state.title}
                                error={errors.title ? true : false}
                                onChange={this.handleChange}
                                />
                                
                                {/* This is the todo details*/}
                                <TextField className={classes.formItems}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="todoDetails"
                                    label="Todo Details"
                                    name="body"
                                    autoComplete="todoDetails"
                                    multiline
                                    rows={20}
                                    rowsMax={20}
                                    helperText={errors.body}
                                    error={errors.body ? true : false}
                                    onChange={this.handleChange}
                                    value={this.state.body}
                                />
                            </form>
                        </Dialog>

                        <article style={articleStyle}>
                            <section style={sectionStyle}>
                                <Typography variant="h4" component="h2">
                                    Backlog
                                </Typography>
                                {this.state.backLog.map(todo => 
                                        <Card className={classes.root} variant="outlined">
                                            <CardContent>
                                                <Typography variant="h5" component="h2">
                                                    {todo.title}
                                                </Typography>
                                                <Typography variant="body2" component="p">
                                                    {`${todo.body.substring(0, 65)}`}
                                                </Typography>
                                            </CardContent>
                                            <CardActions style={{alignSelf:'flex-end'} }>
                                                <Button variant="outlined" size="small" color="primary" onClick={() => this.handleViewOpen({ todo })}>
                                                    View
                                                </Button>
                                                <Button variant="contained" size="small" color="primary" onClick={() => this.handleEditClickOpen({ todo })}>
                                                    Edit
                                                </Button>
                                                <Button  size="small" color="primary" onClick={() => this.deleteTodoHandler({ todo })}>
                                                    Delete
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    // </Grid>
                                )}
                            </section>
                            <section style={sectionStyle}>
                                <Typography variant="h4" component="h2">
                                    In Progress
                                </Typography>
                                {this.state.inProgress.map(todo => 
                                    <Card className={classes.root} variant="outlined">
                                        <CardContent>
                                            <Typography variant="h5" component="h2">
                                                {todo.title}
                                            </Typography>
                                            <Typography variant="body2" component="p">
                                                {`${todo.body.substring(0, 65)}`}
                                            </Typography>
                                        </CardContent>
                                        <CardActions style={{alignSelf:'flex-end'} }>
                                            <Button variant="outlined" size="small" color="primary" onClick={() => this.handleViewOpen({ todo })}>
                                                View
                                            </Button>
                                            <Button variant="outlined" size="small" color="primary" onClick={() => this.handleEditClickOpen({ todo })}>
                                                Edit
                                            </Button>
                                            <Button variant="outlined" size="small" color="primary" onClick={() => this.deleteTodoHandler({ todo })}>
                                                Delete
                                            </Button>
                                        </CardActions>
                                    </Card>
                                )}
                            </section>
                            <section style={sectionStyle}>
                                <Typography variant="h4" component="h2">
                                    Complete
                                </Typography>
                                {this.state.complete.map(todo => 
                                    <Card className={classes.root} variant="outlined">
                                        <CardContent>
                                            <Typography variant="h5" component="h2">
                                                {todo.title}
                                            </Typography>
                                            <Typography variant="body2" component="p">
                                                {`${todo.body.substring(0, 65)}`}
                                            </Typography>
                                        </CardContent>
                                        <CardActions style={{alignSelf:'flex-end'} }>
                                            <Button size="small" color="primary" onClick={() => this.handleViewOpen({ todo })}>
                                                View
                                            </Button>
                                            <Button variant="outlined"size="small" color="primary" onClick={() => this.handleEditClickOpen({ todo })}>
                                                Edit
                                            </Button>
                                            <Button variant="contained"size="small" color="primary" onClick={() => this.deleteTodoHandler({ todo })}>
                                                Delete
                                            </Button>
                                        </CardActions>
                                    </Card>
                                )}
                            </section>
                        </article>
    
                        <Dialog
                            onClose={handleViewClose}
                            aria-labelledby="customized-dialog-title"
                            open={viewOpen}
                            fullWidth
                            classes={{ paperFullWidth: classes.dialogeStyle }}
                        >
                            <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
                                {this.state.title}
                            </DialogTitle>
                            <DialogContent dividers>
                                <TextField
                                    fullWidth
                                    id="todoDetails"
                                    name="body"
                                    multiline
                                    readonly
                                    rows={1}
                                    rowsMax={25}
                                    value={this.state.body}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
                    </main>
                );
            }
        }
    }

    export default withStyles(styles)(todo);