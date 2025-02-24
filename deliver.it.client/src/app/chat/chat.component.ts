import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Message } from '../models/message.model';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-chat',
  standalone: false,
  
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  messages: Message[] = [];
  newMessage: string = '';
  users: User[] = [];
  selectedUserId: string = '';
  isAdmin: boolean = false;
  constructor(private http: HttpClient, private authService: AuthService) { }
  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRole() === '1';
    if (this.isAdmin) {
      this.getUsers();
    } else {
      this.authService.getUserByUsername('adminer').subscribe(
        (adminUser) => {
          this.selectedUserId = adminUser.id;
          this.getMessages();
        },
        (error) => {
          console.error('Error fetching admin user', error);
        }
      );
    }
  }

  getUsers(): void {
    this.authService.getAllUsers().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  getMessages(): void {
    this.http.get<Message[]>(`/getMessages?receiverId=${this.selectedUserId}`).subscribe(
      (data) => {
        this.messages = data;
      },
      (error) => {
        console.error('Error fetching messages', error);
      }
    );
  }

  sendMessage(): void {
    const message = { text: this.newMessage, receiverId: this.selectedUserId };
    this.http.post('/sendMessage', message).subscribe(
      () => {
        this.newMessage = '';
        this.getMessages();
      },
      (error) => {
        console.error('Error sending message', error);
      }
    );
  }

  onUserSelect(event: any): void {
    this.selectedUserId = event.value;
    this.getMessages();
  }


}
