import {updateServerDetails} from '@front/components/actions/updateServerDetails';
import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {ServerDetailsDto, UpdateServerDetailsDto} from '@shared/dto';
import {useMutation} from '@tanstack/react-query';

export const updateServerDetailsCommand = (hostName: string) => {
    const queryClient = getQueryClient();

    return useMutation<ServerDetailsDto, Error, UpdateServerDetailsDto>(
        {
            mutationFn: async (details) => updateServerDetails(hostName, details),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [`/servers/${hostName}`],
                    exact: true,
                });
            },
        },
        queryClient,
    );
};
