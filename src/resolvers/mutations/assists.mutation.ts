import {Arg, Int, Mutation, PubSub, PubSubEngine, Resolver} from "type-graphql";

import {AssistsResponse} from "../../errors/assists.response";
import {Assists} from "../../entity/assists.entity";
import {Accept, AssistsInput} from "../../inputs/assists.input";
import { getRepository } from "typeorm";

@Resolver()
export class AssistsMutation {
  @Mutation(() => AssistsResponse, {nullable: true})
  async createInvitation(
    @Arg("options", () => AssistsInput) options: AssistsInput,
    @PubSub() pubsub: PubSubEngine
  ): Promise<AssistsResponse> {
    const assists = await Assists.create({...options}).save();
    pubsub.publish("NEW_INVITATION", assists);

    return {assists};
  }

  @Mutation(() => Boolean,{nullable: true})
  async acceptInvitation(
    @Arg("assits_id", () => Int)assits_id: number,
    @Arg("options", () => Accept)options:Accept): Promise<Boolean>{
    await getRepository(Assists)
    .createQueryBuilder("assists")
    .innerJoinAndSelect("assists.meeting", "meeting")
    .innerJoinAndSelect("assists.user", "user")
    .where("user.ci = 123")
    .getOne()

    const accept_invitation = await Assists.update({assits_id}, options)

    if(options.accepted === false){
      await Assists.delete({assits_id}                                                                                                     )

      console.log("borrada")
    }

    if(!accept_invitation){
      console.log("nan")
    }

    return true
  }
}
