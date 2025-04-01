import {parseResult} from '@core';
import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useMutation} from '@tanstack/react-query';
import {CreateServerDto, CreateServerResponseDto} from '@shared/dto';
import {createServer} from '@front/components/actions/createServer';
import {useErrorNotification} from '@front/components/helpers/useErrorNotification';

export const useCreateServer = () => {
    const queryClient = getQueryClient();

    return useMutation<CreateServerResponseDto, Error, CreateServerDto>(
        {
            mutationFn: async (data) => {
                const result = parseResult(await createServer(data));
                if (result.isErr()) {
                    throw result.unwrapErr();
                }
                return result.unwrap();
            },
            onError: useErrorNotification(),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['/servers'],
                    exact: false,
                    refetchType: 'all',
                });
            },
        },
        queryClient,
    );
};
