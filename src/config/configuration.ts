import {registerAs} from '@nestjs/config'

export default registerAs('config',() => ({

    itracksafe:{


    },
    database:{


    },
    export:{


    },
    // port: parseInt(process.env.PORT)
}));