import {parseResult} from '@core';
import {updateServerDetails} from '@front/components/actions/updateServerDetails';
import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {ServerDetailsDto, UpdateServerDetailsDto} from '@shared/dto';
import {useMutation} from '@tanstack/react-query';
import {useErrorNotification} from '../../helpers/useErrorNotification';

export const updateServerDetailsCommand = (hostName: string) => {
    const queryClient = getQueryClient();

    return useMutation<ServerDetailsDto, Error, UpdateServerDetailsDto>(
        {
            mutationFn: async (details) => {
                const result = parseResult(
                    await updateServerDetails(hostName, details),
                );
                if (result.isErr()) {
                    throw result.unwrapErr();
                }
                return result.unwrap();
            },
            onError: useErrorNotification(),
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
