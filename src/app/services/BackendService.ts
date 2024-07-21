import { environment } from "../../environments/environment";

export class BackendService {
    public static serviceUrl = environment.api;
    public static login = BackendService.serviceUrl + 'app/login';
    public static signup = BackendService.serviceUrl + 'app/signup';
    public static createTask = BackendService.serviceUrl + 'app/sample'
    public static modifyTask = BackendService.serviceUrl + 'task/modify'
    public static fetchTasks = BackendService.serviceUrl + 'task/fetchTickets'
    public static googleLogin = BackendService.serviceUrl + 'app/sample'

}