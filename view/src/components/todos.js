import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';

import axios from 'axios';



const styles = ((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    }, 
    //inside create to do
    toolbar: theme.mixins.toolbar,
    title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	submitButton: {
		display: 'block',
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: 14,
		right: 10
	},

    //Position our button
	floatingButton: {
		position: 'fixed',
		bottom: 0,
		right: 0
	},
	form: {
		width: '98%',
        margin: 'auto'
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
	// dialogStyle: {
	// 	maxWidth: '50%'
	// },
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	}
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
                        <div className={classes.toolbar} />
                        {this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
                    </main>
                );
            } else {
                //project tracker dashboard
                return (
                    <main className={classes.content}>
                    <Typography variant="h5" color="primary" align="center">Project Tracker</Typography>    

                        {/* <div className={classes.toolbar} /> */}
    
                        <IconButton
                            className={classes.floatingButton}
                            color="primary"
                            aria-label="Add Todo"
                            onClick={handleClickOpen}
                        >
                        <AddCircleIcon style={{ fontSize: 60 }} />
                        </IconButton>

                        {/*Dialog screen is Modal */}
                        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                            {/*Appbar is header for Modal */}
                            <AppBar className={classes.appBar}>
                                {/*Toolbar is parent of IconButton, Button and Typography */}
                                <Toolbar>
                                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h6" className={classes.title}>
                                        {this.state.buttonType === 'Edit' ? 'Edit Todo' : 'Create a new Todo'}
                                    </Typography>
                                    <Button
                                        autoFocus
                                        color="inherit"
                                        // {/*handleSubmit reads buttonType state, if state is empty string, then post to Add todo API. If state is Edit, then update Edit Todo*/}
                                        onClick={handleSubmit}
                                        className={classes.submitButton}
                                    >
                                        {this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
                                    </Button>
                                </Toolbar>
                            </AppBar>

                            

                            {/* Our form to add a todo item */}
                            <form className={classes.form} noValidate>
                                {/* To display todo list, use Grid and grid items, card component will display data */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
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
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="todoDetails"
                                            label="Todo Details"
                                            name="body"
                                            autoComplete="todoDetails"
                                            multiline
                                            rows={25}
                                            rowsMax={25}
                                            helperText={errors.body}
                                            error={errors.body ? true : false}
                                            onChange={this.handleChange}
                                            value={this.state.body}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl>
                                            <InputLabel id="statusLabel">Status</InputLabel>
                                            <Select 
                                            labelId="statusLabel" 
                                            id="select" 
                                            value={this.state.status}
                                            onChange={this.handleSelect}>
                                                <MenuItem value={'backLog'}>BackLog</MenuItem>
                                                <MenuItem value={'inProgress'}>In Progress</MenuItem>
                                                <MenuItem value={'complete'}>Complete</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </form>
                        </Dialog>

                        <Grid container spacing={4}>
                            <Grid container item xs={4} spacing={2}>
                                {this.state.backLog.map(todo => 
                                    <Grid container item xs={12} spacing={2}>
                                        <Card className={classes.root} variant="outlined">
                                            <CardContent>
                                                <Typography variant="h5" component="h2">
                                                    {todo.title}
                                                </Typography>
                                                <Typography variant="body2" component="p">
                                                    {`${todo.body.substring(0, 65)}`}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" color="primary" onClick={() => this.handleViewOpen({ todo })}>
                                                    {' '}
                                                    View{' '}
                                                </Button>
                                                <Button size="small" color="primary" onClick={() => this.handleEditClickOpen({ todo })}>
                                                    Edit
                                                </Button>
                                                <Button size="small" color="primary" onClick={() => this.deleteTodoHandler({ todo })}>
                                                    Delete
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid container item xs={4} spacing={2}>
                                {this.state.inProgress.map(todo => 
                                    <Grid item xs={12}>
                                        <Card className={classes.root} variant="outlined">
                                            <CardContent>
                                                <Typography variant="h5" component="h2">
                                                    {todo.title}
                                                </Typography>
                                                <Typography variant="body2" component="p">
                                                    {`${todo.body.substring(0, 65)}`}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" color="primary" onClick={() => this.handleViewOpen({ todo })}>
                                                    {' '}
                                                    View{' '}
                                                </Button>
                                                <Button size="small" color="primary" onClick={() => this.handleEditClickOpen({ todo })}>
                                                    Edit
                                                </Button>
                                                <Button size="small" color="primary" onClick={() => this.deleteTodoHandler({ todo })}>
                                                    Delete
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid container item xs={4} spacing={2}>
                                {this.state.complete.map(todo => 
                                    <Grid item xs={12}>
                                        <Card className={classes.root} variant="outlined">
                                            <CardContent>
                                                <Typography variant="h5" component="h2">
                                                    {todo.title}
                                                </Typography>
                                                <Typography variant="body2" component="p">
                                                    {`${todo.body.substring(0, 65)}`}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" color="primary" onClick={() => this.handleViewOpen({ todo })}>
                                                    {' '}
                                                    View{' '}
                                                </Button>
                                                <Button size="small" color="primary" onClick={() => this.handleEditClickOpen({ todo })}>
                                                    Edit
                                                </Button>
                                                <Button size="small" color="primary" onClick={() => this.deleteTodoHandler({ todo })}>
                                                    Delete
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
    
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