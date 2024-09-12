import { KeeneticService } from './services/keenetic-service';
import dotenv from 'dotenv';

//Apple Shortcuts script to toggle VPN
//https://www.icloud.com/shortcuts/b5ecf5e3adf444869e43084da35a4164

//Need to set the following environment variables:
//KEENETIC_HOST
//KEENETIC_USER
//KEENETIC_PASSWORD
dotenv.config();

function areEnvironmentVariablesSet(): boolean {
  return (
    process.env.KEENETIC_HOST !== undefined &&
    process.env.KEENETIC_USER !== undefined &&
    process.env.KEENETIC_PASSWORD !== undefined
  );
}

async function bootstrap() {
  if (!areEnvironmentVariablesSet()) {
    throw new Error('Variáveis de ambiente não estão definidas!');
  }
  const host = process.env.KEENETIC_HOST!;
  const user = process.env.KEENETIC_USER!;
  const password = process.env.KEENETIC_PASSWORD!;

  const previousUpVpnState =
    await KeeneticService.toggleVpnAndReturnPreviousState(host, user, password);

  previousUpVpnState
    ? console.log('VPN foi desligada!')
    : console.log('VPN foi ligada!');
}

bootstrap().catch((err) => {
  console.error('Erro ao acessar o roteador:', err);
  process.exit(1);
});
