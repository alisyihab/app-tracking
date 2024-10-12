import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { TrackingService } from './services/tracking.service';

@WebSocketGateway({ cors: true }) // Enable CORS for WebSocket
export class TrackingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly trackingService: TrackingService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Method untuk menerima update dari client
  @SubscribeMessage('createTracking')
  async handleTrackingUpdate(client: Socket, trackingDto: CreateTrackingDto) {
    const tracking = await this.trackingService.createTracking(trackingDto);

    // Broadcast tracking data ke semua client yang terhubung
    this.server.emit('trackingUpdate', tracking);

    return tracking;
  }
}
